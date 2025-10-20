# Auto Sync Script for GitHub
# Run this script after making changes in Cursor

Write-Host "🔄 Syncing changes to GitHub..." -ForegroundColor Cyan

# Check if there are changes
$status = & "C:\Program Files\Git\bin\git.exe" status --porcelain
if ($status) {
    Write-Host "📝 Found changes, adding to Git..." -ForegroundColor Yellow
    
    # Add all changes
    & "C:\Program Files\Git\bin\git.exe" add .
    
    # Get commit message from user
    $commitMessage = Read-Host "Enter commit message (or press Enter for 'Auto sync')"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "Auto sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
    
    # Commit changes
    & "C:\Program Files\Git\bin\git.exe" commit -m $commitMessage
    
    # Push to GitHub
    Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Green
    & "C:\Program Files\Git\bin\git.exe" push origin master
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully synced to GitHub!" -ForegroundColor Green
        Write-Host "🌐 View your changes at: https://github.com/yabhishek2004/AST-Pickle-Pro-Panel" -ForegroundColor Blue
    } else {
        Write-Host "❌ Failed to sync to GitHub. Please check your connection." -ForegroundColor Red
    }
} else {
    Write-Host "✅ No changes detected. Everything is up to date!" -ForegroundColor Green
}