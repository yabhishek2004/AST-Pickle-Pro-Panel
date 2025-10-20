# Automatic GitHub Sync - Runs Forever
# This script automatically syncs your changes to GitHub every time you save a file

Write-Host "🤖 Starting Automatic GitHub Sync..." -ForegroundColor Green
Write-Host "📁 Watching: $PWD" -ForegroundColor Yellow
Write-Host "🔄 Every file save will automatically sync to GitHub" -ForegroundColor Cyan
Write-Host "❌ Press Ctrl+C to stop" -ForegroundColor Red
Write-Host ""

# Function to automatically sync changes
function Auto-SyncToGitHub {
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] 🔄 File changed! Auto-syncing..." -ForegroundColor Yellow
    
    # Add all changes silently
    & "C:\Program Files\Git\bin\git.exe" add . 2>$null
    
    # Check if there are actual changes
    $status = & "C:\Program Files\Git\bin\git.exe" status --porcelain
    if ($status) {
        # Commit with automatic message
        $commitMsg = "Auto-sync: $timestamp - $(Get-Date -Format 'yyyy-MM-dd')"
        & "C:\Program Files\Git\bin\git.exe" commit -m $commitMsg --quiet 2>$null
        
        # Push to GitHub
        $result = & "C:\Program Files\Git\bin\git.exe" push origin master 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$timestamp] ✅ Auto-synced to GitHub!" -ForegroundColor Green
        } else {
            Write-Host "[$timestamp] ❌ Auto-sync failed" -ForegroundColor Red
        }
    } else {
        Write-Host "[$timestamp] ✅ No changes to sync" -ForegroundColor Gray
    }
}

# Create file system watcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $PWD
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Register the event handler
Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action {
    Start-Sleep -Seconds 1  # Wait for file to be fully written
    Auto-SyncToGitHub
} | Out-Null

# Keep the script running forever
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    $watcher.Dispose()
    Write-Host "🛑 Auto-sync stopped" -ForegroundColor Red
}
