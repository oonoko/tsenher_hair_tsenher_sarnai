@echo off
chcp 65001 >nul
cd /d "%~dp0frontend"
if not exist node_modules (
  echo npm install хийж байна...
  call npm install
)
echo.
echo Next.js frontend ажиллаж байна: http://localhost:3002
echo Backend: http://localhost:3000
echo.
call npm run dev
pause
