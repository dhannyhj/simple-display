@echo off
REM ======================================
REM Simple Display - Dev Server Launcher
REM ======================================

cd /d "%~dp0"

echo.
echo [INFO] Starting development server...
echo [INFO] Open http://localhost:3000 in your browser
echo.

node_modules\.bin\next dev --port 3000

pause
