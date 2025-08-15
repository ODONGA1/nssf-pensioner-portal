# Reset PostgreSQL postgres user password
# This script helps reset the postgres user password

Write-Host "=== PostgreSQL Password Reset ===" -ForegroundColor Green
Write-Host ""

Write-Host "To reset the postgres user password, we need to:" -ForegroundColor Yellow
Write-Host "1. Stop the PostgreSQL service" -ForegroundColor White
Write-Host "2. Temporarily change authentication to 'trust'" -ForegroundColor White  
Write-Host "3. Start PostgreSQL service" -ForegroundColor White
Write-Host "4. Connect and change the password" -ForegroundColor White
Write-Host "5. Restore authentication to 'scram-sha-256'" -ForegroundColor White
Write-Host ""

$proceed = Read-Host "Do you want to proceed with password reset? (y/n)"
if ($proceed -eq 'y' -or $proceed -eq 'Y') {
    Write-Host ""
    Write-Host "Step 1: Stopping PostgreSQL service..." -ForegroundColor Blue
    Stop-Service -Name "postgresql-x64-17" -Force
    Start-Sleep -Seconds 3
    
    Write-Host "Step 2: Backing up pg_hba.conf..." -ForegroundColor Blue
    $pgHbaPath = "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"
    $backupPath = "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.backup"
    Copy-Item $pgHbaPath $backupPath
    
    Write-Host "Step 3: Temporarily changing authentication to trust..." -ForegroundColor Blue
    # Read the file and replace scram-sha-256 with trust
    $content = Get-Content $pgHbaPath
    $content = $content -replace "scram-sha-256", "trust"
    Set-Content $pgHbaPath $content
    
    Write-Host "Step 4: Starting PostgreSQL service..." -ForegroundColor Blue
    Start-Service -Name "postgresql-x64-17"
    Start-Sleep -Seconds 5
    
    Write-Host "Step 5: Setting new password..." -ForegroundColor Blue
    Write-Host "Enter the new password for postgres user:" -ForegroundColor Yellow
    $newPassword = Read-Host -MaskInput
    
    # Set the new password
    $sql = "ALTER USER postgres PASSWORD '$newPassword';"
    echo $sql | psql -U postgres -h localhost
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Password changed successfully!" -ForegroundColor Green
        
        Write-Host "Step 6: Restoring authentication configuration..." -ForegroundColor Blue
        Stop-Service -Name "postgresql-x64-17" -Force
        Start-Sleep -Seconds 3
        
        # Restore the original pg_hba.conf
        Copy-Item $backupPath $pgHbaPath
        
        Start-Service -Name "postgresql-x64-17"
        Start-Sleep -Seconds 5
        
        Write-Host "✓ Authentication restored. You can now use the new password." -ForegroundColor Green
        Write-Host ""
        Write-Host "Test the connection with:" -ForegroundColor Yellow
        Write-Host "psql -U postgres -h localhost" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Failed to change password. Restoring configuration..." -ForegroundColor Red
        Stop-Service -Name "postgresql-x64-17" -Force
        Copy-Item $backupPath $pgHbaPath
        Start-Service -Name "postgresql-x64-17"
    }
} else {
    Write-Host "Password reset cancelled." -ForegroundColor Yellow
}
