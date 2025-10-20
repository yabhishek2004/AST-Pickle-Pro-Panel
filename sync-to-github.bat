@echo off
echo 🔄 Syncing changes to GitHub...

"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Auto sync: %date% %time%"
"C:\Program Files\Git\bin\git.exe" push origin master

if %errorlevel% equ 0 (
    echo ✅ Successfully synced to GitHub!
    echo 🌐 View your changes at: https://github.com/yabhishek2004/AST-Pickle-Pro-Panel
) else (
    echo ❌ Failed to sync to GitHub. Please check your connection.
)

pause
