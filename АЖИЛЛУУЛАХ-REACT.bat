@echo off
chcp 65001 >nul
cd /d "%~dp0frontend"
if not exist node_modules (
  echo npm install хийж байна...
  call npm install
)
echo.
echo React frontend ажиллаж байна: http://localhost:3001
echo Backend: http://localhost:3000
echo.
call npm run dev
pause
