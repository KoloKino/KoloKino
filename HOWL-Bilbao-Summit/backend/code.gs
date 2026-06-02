// HOWL Bilbao Summit · availability collector
// Sheet columns: savedAt | email | name | surname | days(JSON) | daysCount | origin | sameDest | destination

const SHEET_NAME = 'responses';
const HEADERS = ['savedAt', 'email', 'name', 'surname', 'days', 'daysCount', 'origin', 'sameDest', 'destination'];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const sheet = getSheet_();
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return json_({ ok: true, dayCounts: {}, totalRespondents: 0, respondents: [] });
    }
    const data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
    const dayCounts = {};
    const respondents = [];
    data.forEach(row => {
      const email = (row[1] || '').toString();
      const daysJson = row[4];
      if (!email) return;
      respondents.push({
        email,
        name: row[2] || '',
        surname: row[3] || '',
        daysCount: row[5] || 0,
        origin: row[6] || '',
        savedAt: row[0]
      });
      try {
        const days = (typeof daysJson === 'string') ? JSON.parse(daysJson) : daysJson;
        if (Array.isArray(days)) {
          days.forEach(d => { dayCounts[d] = (dayCounts[d] || 0) + 1; });
        }
      } catch (err) {}
    });
    return json_({
      ok: true,
      dayCounts,
      totalRespondents: respondents.length,
      respondents
    });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const email = ((payload.email || '') + '').trim().toLowerCase();
    if (!email) return json_({ ok: false, error: 'missing email' });

    const sheet = getSheet_();
    const row = [
      new Date(),
      email,
      payload.name || '',
      payload.surname || '',
      JSON.stringify(payload.days || []),
      (payload.days || []).length,
      payload.origin || '',
      payload.sameDest ? 'TRUE' : 'FALSE',
      payload.destination || ''
    ];

    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const emails = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (let i = 0; i < emails.length; i++) {
        if ((emails[i][0] + '').toLowerCase() === email) {
          sheet.getRange(i + 2, 1, 1, row.length).setValues([row]);
          return json_({ ok: true, action: 'updated' });
        }
      }
    }
    sheet.appendRow(row);
    return json_({ ok: true, action: 'created' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
