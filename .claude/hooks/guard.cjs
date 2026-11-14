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
//   - merging PRs or changing GitHub settings via gh
//   - any Firebase command that deploys or changes data/config
//   - reading secrets: .env files, Firebase/gcloud credentials, tokens
//   - editing this guard or the Claude settings that load it
//
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

// ---------- file-path based tools ----------
const SECRET_PATH = [
  /(^|[\\/])\.env($|\.(?!example$)[^\\/]*$)/i, // .env, .env.local, .env.production (not .env.example)
  /firebase-tools\.json$/i,
  /[\\/]configstore[\\/]/i,
  /[\\/]\.config[\\/]gcloud[\\/]/i,
  /application_default_credentials\.json$/i,
  /service[-_]?account[^\\/]*\.json$/i,
  /\.(pem|p12|pfx|key)$/i,
];
const PROTECTED_CONFIG = [/[\\/]\.claude[\\/]settings(\.local)?\.json$/i, /[\\/]\.claude[\\/]hooks[\\/]/i];

function norm(p) {
  return String(p || "").replace(/\//g, "\\");
}

if (["Read", "Edit", "Write", "MultiEdit", "NotebookEdit", "Grep", "Glob"].includes(tool)) {
  const targets = [ti.file_path, ti.notebook_path, ti.path, ti.glob, ti.pattern && tool === "Glob" ? ti.pattern : null]
    .filter(Boolean)
    .map(norm);
  for (const t of targets) {
    if (SECRET_PATH.some((re) => re.test(t))) block(`${tool} on a secrets file (${path.basename(t)})`);
    if ((tool === "Grep" || tool === "Glob") && /(^|[\\/*{,])\.env(?!\.example)/i.test(t))
      block(`${tool} targeting .env files`);
    if (tool !== "Read" && tool !== "Grep" && tool !== "Glob" && PROTECTED_CONFIG.some((re) => re.test(t)))
      block(`${tool} on Claude's own security configuration (${path.basename(t)})`);
  }
  process.exit(0);
}

// ---------- shell commands ----------
if (tool !== "Bash" && tool !== "PowerShell") process.exit(0);

const raw = String(ti.command || "");
// Normalise to defeat trivial obfuscation: quotes, backslash/backtick escapes, extra spaces.
const cmd = raw
  .replace(/['"`^]/g, "")
  .replace(/\\(?=\S)/g, "")
  .replace(/\s+/g, " ")
  .toLowerCase();

const rules = [
  // --- secrets ---
  // `.` and glob chars may precede it too: `.\.env` (PowerShell, after backslash stripping) and `*.env`.
  [/(^|[\s/\\=:<>|;&(.*?])\.env(\b(?!\.example)|$)/, "accessing a .env file"],
  // Wildcards that can expand to .env: `.e?v`, `.en*`, `.[e]nv`, `.{e,x}nv`, `.*`
  [/(^|[\s/\\=:<>|;&(.])\.(?=[e?*[{])[^\s/;|&]*[?*[{]/, "wildcard that can match .env files"],
  [/firebase-tools\.json|configstore|\.config\/gcloud|application_default_credentials/, "accessing stored credentials"],
  [/access_token|refresh_token|id_token|authorization:\s*bearer|print-access-token|login:ci/, "handling auth tokens"],
  [/(^|[\s;&|(])(printenv|env|set|get-childitem env:|gci env:|dir env:)(\s*$|\s*[;&|)])/, "dumping environment variables"],
  [/\$env:\w*(token|key|secret|pass)|\$\{?\w*(token|secret|password|api_?key)\w*\}?/, "reading secret environment variables"],

  // --- git: protected branches / history ---
  [/\bgit\b[^;&|]*?\spush\b.*(\s--force\b|\s--force-with-lease|\s-f\b|\s\+\S)/, "force push"],
  [/\bgit\b[^;&|]*?\spush\b.*(\bmain\b|\bmaster\b)/, "push to main/master"],
  [/\bgit\b[^;&|]*?\spush\b.*(\s--delete\b|\s-d\b|\s:\S)/, "deleting a remote branch"],
  [/\bgit\b[^;&|]*?\spush\b.*\s--(all|mirror|tags)\b/, "bulk push"],
  // Variables / command substitution in a push hide the real target (`B=main; git push origin $B`).
  [/\bgit\b[^;&|]*?\spush\b[^;&|]*\$/, "git push with a variable or command substitution"],
  [/\bgit\b[^;&|]*?\s(filter-branch|filter-repo|replace)\b/, "rewriting git history"],
  [/\bgit\b[^;&|]*?\sreflog\s+(expire|delete)|\bgit\b[^;&|]*?\sgc\b.*--prune|\bgit\b[^;&|]*?\supdate-ref\s+-d/, "destroying git history"],
  [/\bgit\b[^;&|]*?\sreset\s+--hard/, "git reset --hard"],
  [/\bgit\b[^;&|]*?\sbranch\s+.*-(d|delete|D)\b/i, "deleting a branch"],
  [/\bgit\b[^;&|]*?\scommit\b.*--amend/, "amending a commit"],
  [/\bgit\b[^;&|]*?\sconfig\b.*(--global|--system)/, "changing global git config"],
  [/\bgit\b[^;&|]*?\sconfig\b.*\b(core\.hookspath|alias\.)/, "changing git hooks/aliases"],

  // --- GitHub ---
  [/\bgh\s+pr\s+(merge|close)\b/, "merging/closing a PR"],
  [/\bgh\s+repo\s+(edit|delete|rename|archive)\b/, "changing GitHub repo settings"],
  [/\bgh\s+api\b.*(-x|--method)\s*(post|put|patch|delete)\b/, "write call to the GitHub API"],
  [/\bgh\s+(secret|variable|ruleset)\b/, "changing GitHub secrets/rules"],

  // --- Firebase / Google Cloud ---
  [/\bfirebase\b.*\b(deploy|hosting:|firestore:delete|database:|auth:|functions:|remoteconfig:|appcheck|use\s+--add|init\b|projects:create|apps:create)/, "Firebase deploy/data/config change"],
  [/\bgcloud\b/, "gcloud command"],
  [/googleapis\.com/, "direct Google API call"],

  // --- self-protection: this guard and the settings that load it ---
  [/\.claude[\\/](settings(\.local)?\.json|hooks)/, "touching Claude's security configuration from the shell"],
];

for (const [re, why] of rules) {
  if (re.test(cmd)) block(why);
}

// `git push` with no explicit branch while main is checked out.
if (/\bgit\b[^;&|]*?\spush\b/.test(cmd) && !/\s(-u|--set-upstream)\s+origin\s+\S+/.test(cmd)) {
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
