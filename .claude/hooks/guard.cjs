#!/usr/bin/env node
// PreToolUse guard for Claude Code in this repo.
//
// Claude Code runs this before every matching tool call and passes the call as
// JSON on stdin. Exit code 2 blocks the call and the stderr message is shown to
// Claude. Unlike `permissions.deny` prefix rules, this inspects the WHOLE
// command (so `cd x && git push origin main` is caught too).
//
// Blocked without the owner's explicit approval (the owner runs these herself):
//   - pushing to main/master, any force push, deleting remote branches
//   - rewriting/destroying git history
//   - changing git config in risky ways (aliases, hooks, credentials, remotes,
//     inline `git -c`, GIT_CONFIG_* env), writing to .git/config or .git/hooks
//   - merging PRs or changing GitHub settings via gh
//   - any Firebase command that deploys or changes data/config
//   - reading secrets: .env files, Firebase/gcloud/git credentials, tokens
//   - writing scripts/package.json that contain any of the above (write-then-run)
//   - piping downloaded code into a shell
//   - creating/running cloud agents (RemoteTrigger), which run outside this guard
//   - editing this guard or the Claude settings that load it
//
// Covers tools: Bash, PowerShell, Monitor (shell commands), Read, Edit, Write,
// MultiEdit, NotebookEdit, Grep, Glob, RemoteTrigger.
// Fails CLOSED: if the input can't be parsed, the call is blocked.

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function block(reason) {
  process.stderr.write(
    `BLOCKED by .claude/hooks/guard.cjs: ${reason}\n` +
      "This action needs the project owner's explicit approval. Do not retry it with " +
      "a different command; ask the owner to run it herself or to approve it.\n"
  );
  process.exit(2);
}

let input;
try {
  input = JSON.parse(fs.readFileSync(0, "utf8"));
} catch {
  block("could not parse the tool call (failing closed)");
}

const tool = input.tool_name || "";
const ti = input.tool_input || {};
const cwd = input.cwd || process.cwd();

// Normalise shell-ish text to defeat trivial obfuscation: quotes, backslash/backtick escapes, spaces.
function normCmd(s) {
  return String(s || "")
    .replace(/['"`^]/g, "")
    .replace(/\\(?=\S)/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

// ---------- rules applied to shell commands (and to script contents being written) ----------
const GIT = String.raw`\bgit\b[^;&|]*?\s`;
const SAFE_GIT_C_KEYS = /^(core\.quotepath|user\.name|user\.email|color\.[\w.]+|advice\.[\w.]+|init\.defaultbranch)=/;

const COMMAND_RULES = [
  // --- secrets ---
  // `.` and glob chars may precede it too: `.\.env` (PowerShell, after backslash stripping) and `*.env`.
  [/(^|[\s/\\=:<>|;&(.*?])\.env(\b(?!\.example)|$)/, "accessing a .env file"],
  // Wildcards that can expand to .env: `.e?v`, `.en*`, `.[e]nv`, `.{e,x}nv`, `.*`
  [/(^|[\s/\\=:<>|;&(.])\.(?=[e?*[{])[^\s/;|&]*[?*[{]/, "wildcard that can match .env files"],
  [/firebase-tools\.json|configstore|\.config\/gcloud|application_default_credentials/, "accessing stored credentials"],
  [/\.git-credentials|(^|[\s/\\])_?\.?netrc\b|credential\.helper|git\s+credential\b/, "accessing git credentials"],
  [/access_token|refresh_token|id_token|authorization:\s*bearer|print-access-token|login:ci/, "handling auth tokens"],
  [/(^|[\s;&|(])(printenv|env|set|get-childitem env:|gci env:|dir env:)(\s*$|\s*[;&|)])/, "dumping environment variables"],
  [/\$env:\w*(token|key|secret|pass)|\$\{?\w*(token|secret|password|api_?key)\w*\}?/, "reading secret environment variables"],

  // --- git: protected branches / history ---
  [new RegExp(GIT + String.raw`push\b.*(\s--force\b|\s--force-with-lease|\s-f\b|\s\+\S)`), "force push"],
  [new RegExp(GIT + String.raw`push\b.*(\bmain\b|\bmaster\b)`), "push to main/master"],
  [new RegExp(GIT + String.raw`push\b.*(\s--delete\b|\s-d\b|\s:\S)`), "deleting a remote branch"],
  [new RegExp(GIT + String.raw`push\b.*\s--(all|mirror|tags)\b`), "bulk push"],
  // Variables / command substitution in a push hide the real target (`B=main; git push origin $B`).
  [new RegExp(GIT + String.raw`push\b[^;&|]*\$`), "git push with a variable or command substitution"],
  [new RegExp(GIT + String.raw`(filter-branch|filter-repo|replace)\b`), "rewriting git history"],
  [new RegExp(`${GIT}reflog\\s+(expire|delete)|${GIT}gc\\b.*--prune|${GIT}update-ref\\s+-d`), "destroying git history"],
  [new RegExp(GIT + String.raw`reset\s+--hard`), "git reset --hard"],
  [new RegExp(GIT + String.raw`branch\s+.*-(d|delete)\b`), "deleting a branch"],
  [new RegExp(GIT + String.raw`commit\b.*--amend`), "amending a commit"],
  [new RegExp(GIT + String.raw`remote\s+(add|set-url|rename|remove|rm)\b`), "changing git remotes"],

  // --- git configuration: files and env injection ---
  // Separator optional: PowerShell's `.git\hooks` becomes `.githooks` after backslash stripping.
  // (This also covers ~/.gitconfig.)
  [/(^|[^\w])\.git[\\/]?(config|hooks|info)/, "touching .git/config, .git/hooks or .gitconfig from the shell"],
  [/\bgit_(config|config_parameters|config_count|config_key_\d+|config_value_\d+|config_global|config_system|ssh_command|ssh|exec_path|askpass|editor|pager|template_dir|proxy_command)\b/, "git environment-variable injection"],

  // --- GitHub ---
  [/\bgh\s+pr\s+(merge|close)\b/, "merging/closing a PR"],
  [/\bgh\s+repo\s+(edit|delete|rename|archive)\b/, "changing GitHub repo settings"],
  [/\bgh\s+api\b.*(-x|--method)\s*(post|put|patch|delete)\b/, "write call to the GitHub API"],
  [/\bgh\s+(secret|variable|ruleset)\b/, "changing GitHub secrets/rules"],
  [/\bgh\s+auth\s+(token|status\s+.*--show-token)/, "printing the GitHub token"],

  // --- Firebase / Google Cloud ---
  [/\bfirebase\b.*\b(deploy|hosting:|firestore:delete|database:|auth:|functions:|remoteconfig:|appcheck|use\s+--add|init\b|projects:create|apps:create)/, "Firebase deploy/data/config change"],
  [/\bgcloud\b/, "gcloud command"],
  [/googleapis\.com/, "direct Google API call"],

  // --- running downloaded code ---
  [/\b(curl|wget|iwr|invoke-webrequest|irm|invoke-restmethod)\b[^;&]*\|\s*(sh|bash|zsh|node|python\d?|iex|invoke-expression|pwsh|powershell)\b/, "piping downloaded code into a shell"],

  // --- self-protection: this guard and the settings that load it ---
  [/\.claude[\\/](settings(\.local)?\.json|hooks)/, "touching Claude's security configuration from the shell"],
];

// `git config` may only read, or set the local user.name / user.email.
// `c` is lower-cased; `cased` keeps case so `git -C <dir>` is not mistaken for `git -c <key>`.
function checkGitConfig(c, cased) {
  for (const seg of c.split(/[;&|]+/)) {
    const m = seg.match(/\bgit\b[^]*?\sconfig\b(.*)$/);
    if (!m) continue;
    const args = m[1];
    if (/--(global|system|file|blob)\b|\s-f\s/.test(args)) block("changing global/system/file git config");
    const writing = /\s--(add|unset|unset-all|replace-all|rename-section|remove-section|edit)\b|\s(set|unset)\s/.test(args);
    if (!writing && /\s(--get|--get-all|--get-regexp|--list|-l|--show-origin|--show-scope|get|list)\b/.test(args)) continue;
    if (!writing && /^\s+(--local\s+)?[\w.-]+\s*$/.test(args)) continue; // `git config some.key` = read
    if (/^\s+(--local\s+)?user\.(name|email)\s+\S/.test(args)) continue;
    block("changing git config (only reads and local user.name/user.email are allowed)");
  }
  // inline config: git -c key=value ... / --config-env=key=ENV
  for (const m of cased.matchAll(/\bgit\b(?:\s+-[A-Za-z]+(?:\s+(?!-)\S+)?)*?\s+(?:-c\s*|--config-env[=\s])(\S+)/g)) {
    if (!SAFE_GIT_C_KEYS.test(m[1].toLowerCase())) block(`inline git config (-c ${m[1].split("=")[0]})`);
  }
}

function checkCommand(rawText, label) {
  const c = normCmd(rawText);
  const cased = String(rawText || "").replace(/['"`^]/g, "").replace(/\\(?=\S)/g, "").replace(/\s+/g, " ");
  for (const [re, why] of COMMAND_RULES) if (re.test(c)) block(label ? `${label}: ${why}` : why);
  checkGitConfig(c, cased);
  return c;
}

// ---------- file-path based tools ----------
const SECRET_PATH = [
  /(^|[\\/])\.env($|\.(?!example$)[^\\/]*$)/i, // .env, .env.local, .env.production (not .env.example)
  /firebase-tools\.json$/i,
  /[\\/]configstore[\\/]/i,
  /[\\/]\.config[\\/]gcloud[\\/]/i,
  /application_default_credentials\.json$/i,
  /service[-_]?account[^\\/]*\.json$/i,
  /\.(pem|p12|pfx|key)$/i,
  /(^|[\\/])\.git-credentials$/i,
  /(^|[\\/])_?\.?netrc$/i,
];
const PROTECTED_CONFIG = [
  /[\\/]\.claude[\\/]settings(\.local)?\.json$/i,
  /[\\/]\.claude[\\/]hooks[\\/]/i,
  /(^|[\\/])\.git[\\/]config$/i,
  /(^|[\\/])\.git[\\/]hooks([\\/]|$)/i,
  /(^|[\\/])\.git[\\/]info[\\/]/i,
  /(^|[\\/])\.gitconfig$/i,
  /(^|[\\/])\.husky[\\/]/i,
  /(^|[\\/])\.githooks[\\/]/i,
];
// Files that get executed: their new content is checked with the command rules.
const EXECUTABLE_FILE = /\.(c?js|mjs|ts|cts|mts|jsx|tsx|sh|bash|zsh|ps1|psm1|bat|cmd|py|rb|pl)$|(^|[\\/])package\.json$|(^|[\\/])Makefile$/i;

function norm(p) {
  return String(p || "").replace(/\//g, "\\");
}

if (["Read", "Edit", "Write", "MultiEdit", "NotebookEdit", "Grep", "Glob"].includes(tool)) {
  const targets = [ti.file_path, ti.notebook_path, ti.path, ti.glob, ti.pattern && tool === "Glob" ? ti.pattern : null]
    .filter(Boolean)
    .map(norm);
  const writes = !["Read", "Grep", "Glob"].includes(tool);
  for (const t of targets) {
    if (SECRET_PATH.some((re) => re.test(t))) block(`${tool} on a secrets file (${path.basename(t)})`);
    if ((tool === "Grep" || tool === "Glob") && /(^|[\\/*{,])\.env(?!\.example)/i.test(t))
      block(`${tool} targeting .env files`);
    if (writes && PROTECTED_CONFIG.some((re) => re.test(t)))
      block(`${tool} on protected configuration (${t.split(/[\\/]/).slice(-2).join("/")})`);
  }
  // write-then-run: scan the new content of files that can be executed.
  if (writes) {
    const file = norm(ti.file_path || ti.notebook_path);
    const isNotebook = tool === "NotebookEdit";
    if (isNotebook || EXECUTABLE_FILE.test(file)) {
      const pieces = [ti.content, ti.new_string, ti.new_source, ...(Array.isArray(ti.edits) ? ti.edits.map((e) => e.new_string) : [])];
      const text = pieces.filter((x) => typeof x === "string").join("\n");
      if (text) checkCommand(text, `writing ${path.basename(file) || "notebook"} with`);
    }
  }
  process.exit(0);
}

// ---------- cloud agents run outside this guard ----------
if (tool === "RemoteTrigger") {
  if (["create", "update", "run", "create_webhook_trigger"].includes(String(ti.action || "")))
    block(`RemoteTrigger ${ti.action}: cloud agents run outside this guard`);
  process.exit(0);
}

// ---------- shell commands ----------
if (tool !== "Bash" && tool !== "PowerShell" && tool !== "Monitor") process.exit(0);
if (tool === "Monitor" && !ti.command) process.exit(0); // WebSocket source: no shell

// Commit messages / PR texts may legitimately MENTION blocked commands ("blocks push to main").
// Drop only text that the shell can never execute, and only where it feeds a message:
//   - single-quoted args of -m/--message/--title/--body on `git commit|tag` / `gh pr|issue ...` lines
//   - bodies of single-quoted heredocs (<<'EOF') feeding those same commands
// Double quotes (where $(...) runs), unquoted heredocs and anything after the message are still checked.
const MESSAGE_CMD = /\bgit\b[^;&|\n]*\s(commit|tag)\b|\bgh\s+(pr|issue|release)\s+(create|edit|comment|review)\b/i;
function stripMessageText(raw) {
  const out = [];
  const lines = String(raw || "").split("\n");
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (MESSAGE_CMD.test(line)) {
      line = line.replace(/(\s(?:-m|--message|--title|--body|-t|-b)(?:\s+|=))'[^']*'/g, "$1''");
      const hd = line.match(/<<-?\s*'([A-Za-z_][\w]*)'/);
      if (hd) {
        out.push(line);
        while (i + 1 < lines.length && lines[i + 1].trim() !== hd[1]) i++; // skip the literal body
        continue;
      }
    }
    out.push(line);
  }
  return out.join("\n");
}

const cmd = checkCommand(stripMessageText(ti.command));

// `git push` with no explicit branch while main is checked out.
if (new RegExp(GIT + "push\\b").test(cmd) && !/\s(-u|--set-upstream)\s+origin\s+\S+/.test(cmd)) {
  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD", { cwd, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
    if (branch === "main" || branch === "master") block("push while on main/master");
  } catch {
    /* not a git repo here */
  }
}

process.exit(0);
