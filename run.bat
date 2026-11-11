@echo off
setlocal
cd /d "%~dp0"

echo Starting Khannum Organics at http://localhost:8000
start "" /B cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:8000"

where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server 8000
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    python -m http.server 8000
  ) else (
    echo Python was not found. Install Python from https://www.python.org/downloads/
    echo During installation, enable the option to add Python to PATH.
    pause
  )
)
