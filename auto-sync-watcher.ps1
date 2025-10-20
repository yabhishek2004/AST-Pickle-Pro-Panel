# Auto Sync File Watcher
# This script watches for file changes and automatically syncs to GitHub

Write-Host "👀 Starting file watcher for auto-sync..." -ForegroundColor Cyan
Write-Host "📁 Watching: $PWD" -ForegroundColor Yellow
Write-Host "🔄 Changes will be automatically synced to GitHub" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop watching" -ForegroundColor Red

# Function to sync changes
function Sync-ToGitHub {
    Write-Host "`n🔄 File changed! Syncing to GitHub..." -ForegroundColor Yellow
    
    # Add all changes
    & "C:\Program Files\Git\bin\git.exe" add .
    
    # Commit with timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    & "C:\Program Files\Git\bin\git.exe" commit -m "Auto sync: $timestamp" --quiet
    
    # Push to GitHub
    & "C:\Program Files\Git\bin\git.exe" push origin master --quiet
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Synced to GitHub at $timestamp" -ForegroundColor Green
    } else {
        Write-Host "❌ Sync failed at $timestamp" -ForegroundColor Red
    }
}

# Watch for file changes
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $PWD
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Register event handler
Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action {
    Start-Sleep -Seconds 2  # Wait for file to be fully written
    Sync-ToGitHub
} | Out-Null

# Keep the script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    $watcher.Dispose()
}
