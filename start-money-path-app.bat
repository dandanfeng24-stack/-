@echo off
title Money Path App Login Prototype
cd /d "%~dp0"

if not exist "index.html" (
  echo ERROR: index.html not found.
  echo Put this BAT file in the same folder as index.html.
  pause
  exit /b 1
)

if not exist "data\solutions.json" (
  echo ERROR: data\solutions.json not found.
  pause
  exit /b 1
)

set PORT=61188
set URL=http://localhost:%PORT%
echo Starting Money Path App Login Prototype...
echo URL: %URL%
start "" "%URL%"
cmd /c npx --yes serve . -l %PORT%
pause
