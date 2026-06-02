# HOWL Bilbao Summit · Backend

## Google Sheet
**Title:** HOWL Bilbao Summit · Availability  
**ID:** `14a1MOH8hFVa4LiFHBcSwB7LBMXLo4FlmV_ZbaL6cLog`  
**URL:** https://docs.google.com/spreadsheets/d/14a1MOH8hFVa4LiFHBcSwB7LBMXLo4FlmV_ZbaL6cLog/edit  
Open the sheet, switch to the **responses** tab to see each row as the team submits.

## Apps Script Web App
**Deployment ID:** `AKfycbwGjKNASWIhc5ovCQad0asxQPPJXPWeWdMVGw3Ouw47_Ox0wfd0HZ-ECLGv7lYQkuSo`  
**URL:** https://script.google.com/macros/s/AKfycbwGjKNASWIhc5ovCQad0asxQPPJXPWeWdMVGw3Ouw47_Ox0wfd0HZ-ECLGv7lYQkuSo/exec

## API
- `GET /exec` returns `{ok, dayCounts, totalRespondents, respondents}`
- `POST /exec` with JSON body `{email, name, surname, days[], origin, sameDest, destination}` saves/updates a row

The script upserts by email: each person has at most one row, and resubmitting overwrites it.
