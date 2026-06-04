// HOWL Bilbao Summit · availability collector
// Sheet columns: savedAt | email | name | surname | days(JSON) | daysCount | origin | sameDest | destination | notify | companions | notes

const SHEET_NAME = 'responses';
const HEADERS = ['savedAt', 'email', 'name', 'surname', 'days', 'daysCount', 'origin', 'sameDest', 'destination', 'notify', 'companions', 'notes'];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  } else {
    const lastCol = sheet.getLastColumn();
    const currentHeader = lastCol > 0 ? sheet.getRange(1, 1, 1, Math.max(lastCol, HEADERS.length)).getValues()[0] : [];
    let needsUpdate = false;
    for (let i = 0; i < HEADERS.length; i++) {
      if (currentHeader[i] !== HEADERS[i]) { needsUpdate = true; break; }
    }
    if (needsUpdate || sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    if (e && e.parameter && e.parameter.preview === '1') {
      const r = sendPreviewEmail();
      return json_({ ok: true, sent: r });
    }
    const sheet = getSheet_();
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return json_({ ok: true, dayCounts: {}, totalRespondents: 0, respondents: [] });
    const data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
    const dayCounts = {};
    const respondents = [];
    data.forEach(row => {
      const email = (row[1] || '').toString();
      const daysJson = row[4];
      if (!email || email === 'email') return;
      respondents.push({
        email, name: row[2] || '', surname: row[3] || '',
        daysCount: row[5] || 0, origin: row[6] || '',
        savedAt: row[0],
        notify: (row[9] === true || row[9] === 'TRUE' || row[9] === 'true'),
        companions: parseInt(row[10], 10) || 0,
        notes: (row[11] || '').toString(),
        days: (() => { try { return typeof daysJson === 'string' ? JSON.parse(daysJson) : daysJson; } catch (e) { return []; } })()
      });
      try {
        const days = (typeof daysJson === 'string') ? JSON.parse(daysJson) : daysJson;
        if (Array.isArray(days)) days.forEach(d => { dayCounts[d] = (dayCounts[d] || 0) + 1; });
      } catch (err) {}
    });
    return json_({ ok: true, dayCounts, totalRespondents: respondents.length, respondents });
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
      new Date(), email, payload.name || '', payload.surname || '',
      JSON.stringify(payload.days || []), (payload.days || []).length,
      payload.origin || '', payload.sameDest ? 'TRUE' : 'FALSE',
      payload.destination || '', payload.notify ? 'TRUE' : 'FALSE',
      parseInt(payload.companions, 10) || 0,
      (payload.notes || '').toString().slice(0, 2000)
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

// ============================================================================
// NOTIFICATION EMAIL
// ============================================================================

// Six-level green heatmap (plus 0). Buckets are by absolute vote count
// (team is 12 people; 1-2, 3-4, 5-6, 7-8, 9-10, 11-12).
function heatColor_(count) {
  if (!count || count <= 0) return { bg: 'rgba(255,255,255,0.03)', text: '#aea899' };
  if (count <= 2)  return { bg: 'rgba(120,170,90,0.12)', text: '#f0ebe1' };
  if (count <= 4)  return { bg: 'rgba(120,170,90,0.24)', text: '#f0ebe1' };
  if (count <= 6)  return { bg: 'rgba(120,175,90,0.40)', text: '#f0ebe1' };
  if (count <= 8)  return { bg: 'rgba(120,180,90,0.58)', text: '#f0ebe1' };
  if (count <= 10) return { bg: 'rgba(135,200,95,0.78)', text: '#0a0e14' };
  return { bg: '#88c89c', text: '#0a0e14' };
}

function isoDate_(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function findBestWindow_(dayCounts, totalRespondents) {
  const threshold = Math.ceil(totalRespondents * 0.7);
  const days = Object.keys(dayCounts).filter(d => dayCounts[d] >= threshold).sort();
  if (days.length === 0) return null;
  let best = null, current = [days[0]];
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]), cur = new Date(days[i]);
    const diff = (cur - prev) / 86400000;
    if (diff === 1) current.push(days[i]);
    else { if (!best || current.length > best.length) best = current; current = [days[i]]; }
  }
  if (!best || current.length > best.length) best = current;
  return best && best.length >= 3 ? best : null;
}

function fmtDate_(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dn = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][date.getDay()];
  const mn = ['January','February','March','April','May','June','July','August','September','October','November','December'][m - 1];
  return dn + ' ' + d + ' ' + mn;
}

function fmtDateShort_(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const mn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1];
  return d + ' ' + mn;
}

function buildMonthHtml_(year, month, dayCounts, rangeStart, rangeEnd) {
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const first = new Date(year, month, 1);
  const startCol = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let html = '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:18px;">';
  html += '<tr><td colspan="7" style="font-family:Georgia,serif;font-size:18px;color:#f0ebe1;padding:0 0 10px 0;letter-spacing:0.04em;">' + monthNames[month] + ' ' + year + '</td></tr>';
  html += '<tr>';
  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(d => {
    html += '<td style="text-align:center;font-size:10px;letter-spacing:0.16em;color:#aea899;text-transform:uppercase;padding:4px 0 8px 0;font-weight:500;">' + d + '</td>';
  });
  html += '</tr>';
  let day = 1, col = 0;
  while (col < startCol) { html += (col === 0 ? '<tr>' : '') + '<td></td>'; col++; }
  while (day <= daysInMonth) {
    if (col === 0) html += '<tr>';
    const date = new Date(year, month, day);
    const iso = isoDate_(date);
    const inRange = date >= rangeStart && date <= rangeEnd;
    const count = dayCounts[iso] || 0;
    if (!inRange) {
      html += '<td style="text-align:center;padding:8px 0;color:rgba(189,184,168,0.22);font-size:13px;border:1px solid rgba(192,187,168,0.06);background:rgba(255,255,255,0.01);">' + day + '</td>';
    } else {
      const col_ = heatColor_(count);
      html += '<td style="text-align:center;padding:8px 0;color:' + col_.text + ';font-size:13px;border:1px solid rgba(192,187,168,0.12);background:' + col_.bg + ';position:relative;font-weight:' + (count > 0 ? '500' : '300') + ';">';
      html += day + (count > 0 ? ' <span style="font-size:9px;color:rgba(0,0,0,0.5);font-weight:600;vertical-align:super;">' + count + '</span>' : '');
      html += '</td>';
    }
    col++;
    if (col === 7) { html += '</tr>'; col = 0; }
    day++;
  }
  if (col > 0) { while (col < 7) { html += '<td></td>'; col++; } html += '</tr>'; }
  html += '</table>';
  return html;
}

function buildResultsHtml_(respondents, dayCounts) {
  const total = respondents.length;
  const best = findBestWindow_(dayCounts, total);
  const RS = new Date(2026, 5, 15), RE = new Date(2026, 6, 15);

  let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head>';
  html += '<body style="margin:0;padding:0;background:#0a0e14;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;color:#f0ebe1;-webkit-font-smoothing:antialiased;">';
  html += '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0a0e14;padding:32px 16px;">';
  html += '<tr><td align="center">';
  html += '<table cellpadding="0" cellspacing="0" border="0" width="640" style="max-width:640px;background:#11161f;border:1px solid rgba(192,187,168,0.18);border-radius:4px;">';

  html += '<tr><td style="padding:32px 36px 4px 36px;text-align:center;">';
  html += '<div style="letter-spacing:0.5em;font-size:10px;color:#c7dcea;text-transform:uppercase;font-weight:600;">HOWL &middot; Bilbao Summit 2026</div>';
  html += '</td></tr>';

  html += '<tr><td style="padding:4px 36px 24px 36px;text-align:center;">';
  html += '<h1 style="font-family:Georgia,\'Times New Roman\',serif;font-weight:300;font-size:30px;color:#f0ebe1;margin:8px 0 6px 0;letter-spacing:0.02em;line-height:1.15;">The team has voted</h1>';
  html += '<div style="font-size:11px;color:#aea899;letter-spacing:0.16em;text-transform:uppercase;font-weight:500;">' + total + ' of 12 responses received</div>';
  html += '</td></tr>';

  if (best && best.length >= 3) {
    html += '<tr><td style="padding:0 36px;"><table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:rgba(135,200,95,0.1);border:1px solid rgba(135,200,95,0.4);border-radius:3px;">';
    html += '<tr><td style="padding:18px 22px;">';
    html += '<div style="font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#aea899;margin-bottom:6px;font-weight:500;">Best overlap window</div>';
    html += '<div style="font-family:Georgia,serif;font-size:20px;color:#f0ebe1;font-weight:400;line-height:1.3;">' + fmtDate_(best[0]) + ' &mdash; ' + fmtDate_(best[best.length - 1]) + '</div>';
    html += '<div style="font-size:12px;color:#aea899;margin-top:6px;font-weight:300;">' + best.length + ' consecutive days where at least 70% of the team is available</div>';
    html += '</td></tr></table></td></tr>';
  }

  html += '<tr><td style="padding:30px 36px 8px 36px;">';
  html += '<div style="font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#aea899;margin-bottom:12px;font-weight:500;">Votes per day</div>';
  html += buildMonthHtml_(2026, 5, dayCounts, RS, RE);
  html += buildMonthHtml_(2026, 6, dayCounts, RS, RE);
  // Legend
  html += '<table cellpadding="0" cellspacing="0" border="0" style="margin-top:6px;"><tr>';
  html += '<td style="font-size:9px;letter-spacing:0.14em;color:#aea899;text-transform:uppercase;font-weight:500;padding-right:8px;">Votes scale</td>';
  const buckets = [{c:0,l:'0'},{c:1,l:'1-2'},{c:3,l:'3-4'},{c:5,l:'5-6'},{c:7,l:'7-8'},{c:9,l:'9-10'},{c:11,l:'11-12'}];
  buckets.forEach(b => {
    const col = heatColor_(b.c);
    html += '<td style="padding:0 3px;"><div style="display:inline-block;width:22px;height:14px;background:' + col.bg + ';border:1px solid rgba(192,187,168,0.18);border-radius:2px;"></div></td>';
  });
  html += '</tr><tr><td></td>';
  buckets.forEach(b => {
    html += '<td style="font-size:8px;color:#aea899;text-align:center;padding:3px 0 0 0;">' + b.l + '</td>';
  });
  html += '</tr></table>';
  html += '</td></tr>';

  html += '<tr><td style="padding:18px 36px 8px 36px;">';
  html += '<div style="font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#aea899;margin-bottom:12px;font-weight:500;">Who said what</div>';
  html += '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">';
  respondents.forEach(r => {
    const sortedDays = (r.days || []).slice().sort();
    let range = '(none)';
    if (sortedDays.length > 0) {
      range = sortedDays.length === 1 ? fmtDateShort_(sortedDays[0]) : (fmtDateShort_(sortedDays[0]) + ' &rarr; ' + fmtDateShort_(sortedDays[sortedDays.length - 1]));
    }
    const plus = (parseInt(r.companions, 10) || 0);
    const plusBadge = plus > 0 ? ' <span style="font-size:10px;color:#c7dcea;letter-spacing:0.04em;font-weight:500;margin-left:4px;">+' + plus + '</span>' : '';
    html += '<tr><td style="padding:10px 0;border-bottom:1px solid rgba(192,187,168,0.1);">';
    html += '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>';
    html += '<td style="font-size:13px;color:#f0ebe1;font-weight:400;">' + (r.name || '') + ' ' + (r.surname || '') + plusBadge + '</td>';
    html += '<td style="font-size:11px;color:#aea899;text-align:right;letter-spacing:0.06em;">' + (r.daysCount || 0) + ' days &middot; ' + range + '</td>';
    html += '</tr></table>';
    if (r.notes && r.notes.toString().trim()) {
      const safeNote = r.notes.toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      html += '<div style="margin-top:6px;font-size:12px;color:#aea899;font-style:italic;font-weight:300;line-height:1.5;padding-left:2px;border-left:2px solid rgba(199,220,234,0.35);padding-left:10px;">' + safeNote + '</div>';
    }
    html += '</td></tr>';
  });
  html += '</table>';
  html += '</td></tr>';

  html += '<tr><td style="padding:32px 36px 28px 36px;text-align:center;border-top:1px solid rgba(192,187,168,0.12);margin-top:24px;">';
  html += '<div style="letter-spacing:0.4em;color:#c7dcea;font-size:11px;font-weight:600;margin-bottom:8px;">HOWL</div>';
  html += '<div style="font-size:9px;letter-spacing:0.22em;color:#aea899;text-transform:uppercase;line-height:1.6;">Promethean Pictures &middot; Estudios y Soluciones Cinematogr&aacute;ficas Bizkaia</div>';
  html += '</td></tr>';

  html += '</table></td></tr></table></body></html>';
  return html;
}

function buildSampleData_() {
  const respondents = [
    { email:'eem@promethean-pictures.com', name:'Elias',   surname:'Merhige',    days:['2026-06-20','2026-06-21','2026-06-22','2026-06-23','2026-06-24','2026-06-25','2026-06-26','2026-06-27','2026-06-28','2026-06-29'], daysCount:10, companions:1, notes:'Will need a quiet workspace for the morning calls.' },
    { email:'rj@promethean-pictures.com',  name:'Richard', surname:'Johns',      days:['2026-06-21','2026-06-22','2026-06-23','2026-06-24','2026-06-25','2026-06-26','2026-06-27','2026-06-28'], daysCount:8, companions:0, notes:'' },
    { email:'pronins.igors@gmail.com',     name:'Igor',    surname:'Pronin',     days:['2026-06-22','2026-06-23','2026-06-24','2026-06-25','2026-06-26'], daysCount:5, companions:0, notes:'' },
    { email:'pronina.marija.2019@gmail.com',name:'Marija', surname:'Pronina',    days:['2026-06-22','2026-06-23','2026-06-24','2026-06-25','2026-06-26'], daysCount:5, companions:0, notes:'' },
    { email:'creators@kolo-kino.com',      name:'Alex',    surname:'Mandrik',    days:['2026-06-15','2026-06-16','2026-06-17','2026-06-18','2026-06-22','2026-06-23','2026-06-24','2026-06-25','2026-06-26','2026-06-27','2026-06-28','2026-06-29','2026-06-30','2026-07-01','2026-07-02','2026-07-03'], daysCount:16, companions:0, notes:'' },
    { email:'tplim789@gmail.com',          name:'TP',      surname:'Lim',        days:['2026-06-22','2026-06-23','2026-06-24','2026-06-25','2026-06-26','2026-06-27','2026-06-28'], daysCount:7, companions:2, notes:'Bringing the team from Strange Loop side.' },
    { email:'raph.bourdin@gmail.com',      name:'Raphaël', surname:'Bourdin',    days:['2026-06-22','2026-06-23','2026-06-24','2026-06-25','2026-06-26','2026-06-29','2026-06-30','2026-07-01'], daysCount:8, companions:0, notes:'' },
    { email:'david@strangeloop-studios.com',name:'David',  surname:'Wexler',     days:['2026-06-23','2026-06-24','2026-06-25','2026-06-26','2026-06-27','2026-06-28'], daysCount:6, companions:1, notes:'' },
    { email:'gavin.gamboa@gmail.com',      name:'Gavin',   surname:'Gamboa',     days:['2026-06-22','2026-06-23','2026-06-24','2026-06-25','2026-06-26','2026-06-27','2026-06-28','2026-06-29','2026-06-30'], daysCount:9, companions:0, notes:'' },
    { email:'jacob@fonik.dk',              name:'Jacob',   surname:'Kirkegaard', days:['2026-06-22','2026-06-23','2026-06-24','2026-06-25','2026-06-26','2026-06-27','2026-06-28'], daysCount:7, companions:0, notes:'Flying from Copenhagen. Happy to give a sound design talk if useful.' },
    { email:'contact.lizakiladze@gmail.com',name:'Liza',   surname:'Kiladze',    days:['2026-06-21','2026-06-22','2026-06-23','2026-06-24','2026-06-25','2026-06-26'], daysCount:6, companions:0, notes:'' },
    { email:'vafankula@gmail.com',         name:'Sergejs', surname:'Sobolevs',   days:['2026-06-22','2026-06-23','2026-06-24','2026-06-25','2026-06-26','2026-06-27','2026-06-28','2026-06-29'], daysCount:8, companions:0, notes:'' }
  ];
  const dayCounts = {};
  respondents.forEach(r => r.days.forEach(d => { dayCounts[d] = (dayCounts[d] || 0) + 1; }));
  return { respondents, dayCounts };
}

function sendPreviewEmail() {
  const { respondents, dayCounts } = buildSampleData_();
  const htmlBody = buildResultsHtml_(respondents, dayCounts);
  MailApp.sendEmail({
    to: 'creators@kolo-kino.com',
    subject: 'HOWL Bilbao Summit · Preview · The team has voted',
    htmlBody: htmlBody,
    name: 'HOWL Coordination'
  });
  return 'Preview sent to creators@kolo-kino.com';
}
