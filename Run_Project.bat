@echo off
:: ===========================================================================
:: MediPulse HMS - One-Click Project Launcher
:: HCI Project Utility - Run_Project.bat
:: ===========================================================================
:: PURPOSE: Starts both the Express.js backend AND the Vite frontend dev server
::          in separate terminal windows with a single double-click.
::
:: PREREQUISITES (run Check_Requirements.bat first if unsure):
::   1. Node.js 18+ must be installed.
::   2. Run  npm install  in the project root (frontend dependencies).
::   3. Run  cd server && npm install  (backend dependencies).
::
:: USAGE: Double-click Run_Project.bat from the project root directory.
::        Two console windows will open:
::          - "MediPulse Backend"  -> Express API on http://localhost:5000
::          - "MediPulse Frontend" -> Vite dev server on http://localhost:5173
:: ===========================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo  ================================================================
echo   MediPulse HMS ^| One-Click Project Launcher
echo  ================================================================
echo   Project: %~dp0
echo   Time:    %date% %time%
echo  ================================================================
echo.

:: -------------------------------------------------------------------
:: STEP 1: Check Node.js
:: -------------------------------------------------------------------
where node >nul 2>&1
if %errorlevel% neq 0 (
  echo  [FAIL] Node.js is not installed or not on PATH.
  echo         Please install Node.js from https://nodejs.org
  echo         Then run Check_Requirements.bat to verify your setup.
  echo.
  pause
  exit /b 1
)
for /f "tokens=*" %%v in ('node --version 2^>nul') do set "NODE_VER=%%v"
echo  [OK]   Node.js !NODE_VER! detected.

:: -------------------------------------------------------------------
:: STEP 2: Check frontend node_modules
:: -------------------------------------------------------------------
if not exist "node_modules\" (
  echo.
  echo  [FAIL] Frontend dependencies are missing.
  echo         Please run the following command in the project root first:
  echo.
  echo           npm install
  echo.
  echo         Then try running this file again.
  echo         Or run Check_Requirements.bat for a full diagnostic.
  echo.
  pause
  exit /b 1
)
echo  [OK]   Frontend node_modules found.

:: -------------------------------------------------------------------
:: STEP 3: Check backend node_modules
:: -------------------------------------------------------------------
if not exist "server\node_modules\" (
  echo.
  echo  [FAIL] Backend dependencies are missing.
  echo         Please run the following commands first:
  echo.
  echo           cd server
  echo           npm install
  echo           cd ..
  echo.
  echo         Then try running this file again.
  echo.
  pause
  exit /b 1
)
echo  [OK]   Backend node_modules found.

:: -------------------------------------------------------------------
:: STEP 4: Check for duplicate server (optional warning)
:: -------------------------------------------------------------------
netstat -ano | findstr ":5000 " >nul 2>&1
if %errorlevel% equ 0 (
  echo.
  echo  [WARN] Port 5000 is already in use. The backend window may not start.
  echo         If MediPulse is already running, you do not need to start again.
  echo         Close existing instances before launching if needed.
  echo.
  choice /c YN /m "Continue launching anyway? [Y=Yes / N=Cancel]"
  if !errorlevel! equ 2 (
    echo  Launch cancelled.
    pause
    exit /b 0
  )
)

:: -------------------------------------------------------------------
:: STEP 5: Launch Backend (Express API Server)
:: -------------------------------------------------------------------
echo.
echo  [>>]  Starting MediPulse Backend on http://localhost:5000 ...
start "MediPulse Backend — Express API" cmd /k "cd /d "%~dp0server" && echo MediPulse Backend Server && echo ========================== && node index.js"

:: Brief delay so backend can initialise before frontend opens
timeout /t 2 /nobreak >nul

:: -------------------------------------------------------------------
:: STEP 6: Launch Frontend (Vite Dev Server)
:: -------------------------------------------------------------------
echo  [>>]  Starting MediPulse Frontend (Vite) on http://localhost:5173 ...
start "MediPulse Frontend — Vite Dev Server" cmd /k "cd /d "%~dp0" && echo MediPulse Vite Dev Server && echo ========================== && npm run dev"

:: -------------------------------------------------------------------
:: DONE
:: -------------------------------------------------------------------
echo.
echo  ================================================================
echo   Both servers are starting in separate windows.
echo.
echo   Backend  : http://localhost:5000/api/health
echo   Frontend : http://localhost:5173
echo.
echo   To stop:  Close the respective terminal windows.
echo   Problems? Run Check_Requirements.bat for diagnostics.
echo  ================================================================
echo.
echo  Press any key to close this launcher window...
pause >nul
endlocal
