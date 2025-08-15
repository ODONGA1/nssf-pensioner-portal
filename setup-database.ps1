# PostgreSQL Database Setup Script for NSSF Pensioner Portal
# This script sets up the database and user for the NSSF Pensioner Portal

Write-Host "=== NSSF Pensioner Portal Database Setup ===" -ForegroundColor Green
Write-Host ""

# Check if PostgreSQL is running
$service = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if ($service -and $service.Status -eq "Running") {
    Write-Host "✓ PostgreSQL service is running" -ForegroundColor Green
} else {
    Write-Host "✗ PostgreSQL service is not running" -ForegroundColor Red
    Write-Host "Please start PostgreSQL service first" -ForegroundColor Yellow
    exit 1
}

# Test if psql is accessible
try {
    $version = psql --version
    Write-Host "✓ PostgreSQL client is accessible: $version" -ForegroundColor Green
} catch {
    Write-Host "✗ PostgreSQL client (psql) is not accessible" -ForegroundColor Red
    Write-Host "Please ensure PostgreSQL bin directory is in your PATH" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "To set up the database, you need to run the following command:" -ForegroundColor Yellow
Write-Host ""
Write-Host "psql -U postgres -h localhost -f setup-database.sql" -ForegroundColor Cyan
Write-Host ""
Write-Host "You will be prompted for the postgres user password." -ForegroundColor Yellow
Write-Host "If you don't know the password, you can reset it by:" -ForegroundColor Yellow
Write-Host "1. Stopping PostgreSQL service" -ForegroundColor White
Write-Host "2. Starting it in single-user mode" -ForegroundColor White
Write-Host "3. Or reinstalling PostgreSQL" -ForegroundColor White
Write-Host ""

# Ask if user wants to proceed
$proceed = Read-Host "Do you want to run the database setup now? (y/n)"
if ($proceed -eq 'y' -or $proceed -eq 'Y') {
    Write-Host ""
    Write-Host "Running database setup..." -ForegroundColor Blue
    psql -U postgres -h localhost -f setup-database.sql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Database setup completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "You can now test the connection with:" -ForegroundColor Yellow
        Write-Host "psql -U nssf_user -h localhost -d nssf_pensioner_db" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "✗ Database setup failed. Please check the error messages above." -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "Database setup skipped. You can run it manually later." -ForegroundColor Yellow
}
