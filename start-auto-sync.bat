@echo off
title Auto GitHub Sync - AST Pickle Pro Panel
color 0A

echo.
echo ========================================
echo   🤖 AST PICKLE PRO PANEL AUTO-SYNC
echo ========================================
echo.
echo 📁 Project: AST Pickle Pro Panel
echo 🌐 GitHub: https://github.com/yabhishek2004/AST-Pickle-Pro-Panel
echo.
echo 🔄 Starting automatic sync...
echo 💡 Every file save will auto-sync to GitHub
echo ❌ Press Ctrl+C to stop
echo.

powershell -ExecutionPolicy Bypass -File "auto-sync-forever.ps1"

pause
