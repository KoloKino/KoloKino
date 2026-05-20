@echo off
REM ============================================================
REM  Set up Gabe at https://kolo-kino.com/Gabe
REM
REM  Double-click to run. Calls the PowerShell script in this
REM  folder, with execution policy bypass so it just works.
REM ============================================================

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-gabe.ps1"

echo.
pause
