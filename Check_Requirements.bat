@echo off
:: ===========================================================================
:: MediPulse HMS - Prerequisite & Dependency Checker
:: HCI Project Utility - Check_Requirements.bat
:: ===========================================================================
:: PURPOSE: Diagnostic-only. Checks all requirements WITHOUT starting the app.
::          Prints PASS / WARNING / FAIL for each item.
::          Does NOT install, delete, or modify any files.
:: ===========================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

set "PASS=[PASS]   "
set "WARN=[WARNING]"
set "FAIL=[FAIL]   "
set "INFO=[INFO]   "
set "SKIP=[N/A]    "

set "ALL_OK=1"

echo.
echo  ================================================================
echo   MediPulse HMS ^| Prerequisite ^& Dependency Checker
echo  ================================================================
echo   Project Root: %~dp0
echo   Checked at:   %date% %time%
echo  ================================================================
echo.

:: -------------------------------------------------------------------
:: 1. Node.js
:: -------------------------------------------------------------------
echo  ^> Checking Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
  echo  %FAIL% Node.js is NOT installed or not on PATH.
  echo         Fix: Download from https://nodejs.org (LTS recommended)
  set "ALL_OK=0"
) else (
  for /f "tokens=*" %%v in ('node --version 2^>nul') do set "NODE_VER=%%v"
  echo  %PASS% Node.js !NODE_VER! found.
)

:: -------------------------------------------------------------------
:: 2. npm
:: -------------------------------------------------------------------
echo  ^> Checking npm...
where npm >nul 2>&1
if %errorlevel% neq 0 (
  echo  %FAIL% npm is NOT found. Reinstall Node.js (npm is bundled).
  set "ALL_OK=0"
) else (
  for /f "tokens=*" %%v in ('npm --version 2^>nul') do set "NPM_VER=%%v"
  echo  %PASS% npm v!NPM_VER! found.
)

:: -------------------------------------------------------------------
:: 3. node_modules (frontend)
:: -------------------------------------------------------------------
echo  ^> Checking frontend node_modules...
if exist "node_modules\" (
  echo  %PASS% node_modules\ exists (frontend dependencies installed).
) else (
  echo  %FAIL% node_modules\ NOT found.
  echo         Fix: Run  npm install  in the project root.
  set "ALL_OK=0"
)

:: -------------------------------------------------------------------
:: 4. server/node_modules (backend)
:: -------------------------------------------------------------------
echo  ^> Checking backend node_modules...
if exist "server\node_modules\" (
  echo  %PASS% server\node_modules\ exists (backend dependencies installed).
) else (
  echo  %FAIL% server\node_modules\ NOT found.
  echo         Fix: Run  cd server ^&^& npm install  then  cd ..
  set "ALL_OK=0"
)

:: -------------------------------------------------------------------
:: 5. Essential project files
:: -------------------------------------------------------------------
echo  ^> Checking essential project files...
set "MISSING_FILES=0"
for %%f in (package.json index.html vite.config.js src\main.jsx src\App.jsx) do (
  if not exist "%%f" (
    echo  %FAIL% Missing file: %%f
    set "MISSING_FILES=1"
    set "ALL_OK=0"
  )
)
if "!MISSING_FILES!"=="0" (
  echo  %PASS% All essential frontend files are present.
)

echo  ^> Checking backend files...
set "MISSING_SERVER=0"
for %%f in (server\index.js server\db.js server\package.json) do (
  if not exist "%%f" (
    echo  %FAIL% Missing backend file: %%f
    set "MISSING_SERVER=1"
    set "ALL_OK=0"
  )
)
if "!MISSING_SERVER!"=="0" (
  echo  %PASS% All essential backend files are present.
)

:: -------------------------------------------------------------------
:: 6. Port availability (5000 backend, 5173 frontend)
:: -------------------------------------------------------------------
echo  ^> Checking if port 5000 (backend) is free...
netstat -ano | findstr ":5000 " >nul 2>&1
if %errorlevel% equ 0 (
  echo  %WARN% Port 5000 is already in use. Backend may fail to start.
  echo         Fix: Stop the process using port 5000 before launching.
) else (
  echo  %PASS% Port 5000 is available for the backend server.
)

echo  ^> Checking if port 5173 (frontend) is free...
netstat -ano | findstr ":5173 " >nul 2>&1
if %errorlevel% equ 0 (
  echo  %WARN% Port 5173 is already in use. Vite may use a different port.
) else (
  echo  %PASS% Port 5173 is available for the Vite dev server.
)

:: -------------------------------------------------------------------
:: 7. Run Node.js detailed dependency check
:: -------------------------------------------------------------------
echo.
echo  ^> Running detailed dependency version check via Node.js...
if exist "check_requirements.js" (
  node check_requirements.js
) else (
  echo  %SKIP% check_requirements.js not found. Skipping deep dependency check.
)

:: -------------------------------------------------------------------
:: SUMMARY
:: -------------------------------------------------------------------
echo.
echo  ================================================================
if "!ALL_OK!"=="1" (
  echo   STATUS: ALL CHECKS PASSED — Ready to run Run_Project.bat
) else (
  echo   STATUS: ONE OR MORE CHECKS FAILED — Fix issues above first.
  echo   Then re-run this checker before launching the project.
)
echo  ================================================================
echo.
pause
endlocal
