// Zohar landing page: copies new leads from Firebase into this Google Sheet.
// Nothing is exposed to the internet: the script runs on a timer under your own
// Google account, reads new leads from Firebase and appends them to the sheet.
// Copy this whole file into Apps Script (Ctrl+A in the editor, then paste).

// The ID from the sheet URL: docs.google.com/spreadsheets/d/<ID>/edit (kept out of the public repo).
const SPREADSHEET_ID = "PASTE_YOUR_SHEET_ID_HERE";
const SHEET_NAME = "לידים";
const FIREBASE_PROJECT = "zohar-landing-page";
const SYNC_EVERY_MINUTES = 5;

const HEADERS = ["תאריך ושעה", "שם מלא", "טלפון", "שירות", "הסכמה לפי חוק הגנת הפרטיות", "גרסת נוסח ההסכמה", "מזהה פנייה"];
const LAST_SYNC_KEY = "lastSyncedCreatedAt";

// Run this ONCE: approves permissions, turns on the automatic sync and copies existing leads.
function setup() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === "syncLeads")
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("syncLeads").timeBased().everyMinutes(SYNC_EVERY_MINUTES).create();

  const added = syncLeads();
  Logger.log("✅ הכול מוכן. הסנכרון האוטומטי פועל כל " + SYNC_EVERY_MINUTES + " דקות.");
  Logger.log("נוספו עכשיו " + added + " לידים לגיליון, בלשונית '" + SHEET_NAME + "'.");
}

// Runs automatically. Copies leads created since the last run. Returns how many were added.
function syncLeads() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return 0;
  try {
    const props = PropertiesService.getScriptProperties();
    const since = props.getProperty(LAST_SYNC_KEY) || "1970-01-01T00:00:00Z";

    const leads = fetchLeadsSince_(since);
    if (leads.length === 0) return 0;

    const rows = leads.map((lead) => [
      new Date(lead.createdAt),
      clean_(lead.name, 100),
      "'" + clean_(lead.phone, 20), // keep the leading 0
      clean_(lead.service, 60),
      lead.consent === true ? "כן" : "לא",
      clean_(lead.consentVersion, 20),
      lead.id,
    ]);
    const sheet = getSheet_();
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, HEADERS.length).setValues(rows);

    props.setProperty(LAST_SYNC_KEY, leads[leads.length - 1].createdAt);
    return rows.length;
  } finally {
    lock.releaseLock();
  }
}

// Reads leads newer than `since` from Firebase (Firestore), oldest first.
function fetchLeadsSince_(since) {
  const url =
    "https://firestore.googleapis.com/v1/projects/" + FIREBASE_PROJECT +
    "/databases/(default)/documents:runQuery";
  const query = {
    structuredQuery: {
      from: [{ collectionId: "leads" }],
      where: {
        fieldFilter: {
          field: { fieldPath: "createdAt" },
          op: "GREATER_THAN",
          value: { timestampValue: since },
        },
      },
      orderBy: [{ field: { fieldPath: "createdAt" }, direction: "ASCENDING" }],
      limit: 500,
    },
  };
  const res = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
    payload: JSON.stringify(query),
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) {
    throw new Error(
      "קריאה מ-Firebase נכשלה (קוד " + res.getResponseCode() + "). " +
      "ודאו שחשבון הגוגל הזה הוא הבעלים של פרויקט Firebase. " + res.getContentText().slice(0, 200)
    );
  }
  return JSON.parse(res.getContentText())
    .filter((r) => r.document)
    .map((r) => {
      const f = r.document.fields || {};
      return {
        id: r.document.name.split("/").pop(),
        name: (f.name && f.name.stringValue) || "",
        phone: (f.phone && f.phone.stringValue) || "",
        service: (f.service && f.service.stringValue) || "",
        consent: !!(f.consent && f.consent.booleanValue),
        consentVersion: (f.consentVersion && f.consentVersion.stringValue) || "",
        createdAt: f.createdAt && f.createdAt.timestampValue,
      };
    })
    .filter((lead) => lead.createdAt);
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#eaf4ff");
    sheet.setFrozenRows(1);
    sheet.setRightToLeft(true);
    sheet.getRange("A:A").setNumberFormat("dd/MM/yyyy HH:mm");
  }
  return sheet;
}

// Trim, cap length, and neutralise spreadsheet formulas (=, +, -, @) typed into the form.
function clean_(value, max) {
  const s = String(value == null ? "" : value).trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
