@echo off
title Money Path App Fast Start
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js was not found.
  echo Please install Node.js LTS first.
  pause
  exit /b 1
)

set PORT=61188
set URL=http://localhost:%PORT%

echo Starting Money Path App Fast Server...
echo URL: %URL%
echo.

start "" "%URL%"
node server.js

pause
