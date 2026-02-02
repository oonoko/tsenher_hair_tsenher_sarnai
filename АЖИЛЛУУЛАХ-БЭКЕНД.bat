@echo off
chcp 65001 >nul
cd /d "%~dp0backend"
if not exist node_modules (
  echo npm install хийж байна...
  call npm install
)
echo Backend ажиллаж байна: http://localhost:3000
node server.js
pause
