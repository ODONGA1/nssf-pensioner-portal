# NSSF Pensioner Portal - Production Deployment Script (PowerShell)
# This script automates the deployment process for Windows

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("static", "fullstack", "docker", "manual")]
    [string]$DeploymentType = "manual"
)

# Colors for output
$ErrorColor = "Red"
$SuccessColor = "Green"
$WarningColor = "Yellow"
$InfoColor = "Cyan"

function Write-Status {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor $SuccessColor
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor $WarningColor
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor $ErrorColor
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor $InfoColor
}

Write-Host "🚀 NSSF Pensioner Portal - Production Deployment" -ForegroundColor $InfoColor
Write-Host "==================================================" -ForegroundColor $InfoColor

try {
    # Check prerequisites
    Write-Info "Checking prerequisites..."
    
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Error "Git is not installed or not in PATH"
        exit 1
    }
    
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Error "Node.js is not installed or not in PATH"
        exit 1
    }
    
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Error "npm is not installed or not in PATH"
        exit 1
    }
    
    Write-Status "Prerequisites check passed"
    
    # Clean previous builds
    Write-Info "Cleaning previous builds..."
    if (Test-Path "frontend\build") {
        Remove-Item -Recurse -Force "frontend\build"
    }
    if (Test-Path "backend\dist") {
        Remove-Item -Recurse -Force "backend\dist"
    }
    Write-Status "Previous builds cleaned"
    
    # Install dependencies
    Write-Info "Installing frontend dependencies..."
    Set-Location "frontend"
    npm install --production
    if ($LASTEXITCODE -ne 0) {
        throw "Frontend dependency installation failed"
    }
    Write-Status "Frontend dependencies installed"
    
    Write-Info "Installing backend dependencies..."
    Set-Location "..\backend"
    npm install --production
    if ($LASTEXITCODE -ne 0) {
        throw "Backend dependency installation failed"
    }
    Write-Status "Backend dependencies installed"
    
    Set-Location ".."
    
    # Build frontend
    Write-Info "Building frontend for production..."
    Set-Location "frontend"
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Frontend build failed"
    }
    Write-Status "Frontend build completed successfully"
    
    # Build backend
    Write-Info "Building backend for production..."
    Set-Location "..\backend"
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Backend build failed"
    }
    Write-Status "Backend build completed successfully"
    
    Set-Location ".."
    
    # Check build sizes
    Write-Info "Checking build sizes..."
    if (Test-Path "frontend\build") {
        $frontendSize = (Get-ChildItem -Recurse "frontend\build" | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Status "Frontend build size: $([math]::Round($frontendSize, 2)) MB"
    }
    
    if (Test-Path "backend\dist") {
        $backendSize = (Get-ChildItem -Recurse "backend\dist" | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Status "Backend build size: $([math]::Round($backendSize, 2)) MB"
    }
    
    # Create deployment package
    Write-Info "Creating deployment package..."
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $packageName = "nssf-portal-production-$timestamp.zip"
    
    # Create temporary directory for packaging
    $tempDir = "temp_deployment_$timestamp"
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    
    # Copy necessary files
    Copy-Item -Recurse "frontend\build" "$tempDir\frontend-build"
    Copy-Item -Recurse "backend\dist" "$tempDir\backend-dist"
    Copy-Item "backend\package.json" "$tempDir\"
    Copy-Item "README.md" "$tempDir\" -ErrorAction SilentlyContinue
    Copy-Item "DEPLOYMENT.md" "$tempDir\" -ErrorAction SilentlyContinue
    Copy-Item "INSTALLATION.md" "$tempDir\" -ErrorAction SilentlyContinue
    
    # Create zip package
    Compress-Archive -Path "$tempDir\*" -DestinationPath $packageName -Force
    Remove-Item -Recurse -Force $tempDir
    
    Write-Status "Deployment package created: $packageName"
    
    # Get current commit information
    $currentCommit = git rev-parse --short HEAD
    $currentBranch = git branch --show-current
    
    # Display deployment options based on parameter
    Write-Host ""
    Write-Info "Deployment Information:"
    Write-Host "======================="
    Write-Host "Repository: https://github.com/ODONGA1/nssf-pensioner-portal"
    Write-Host "Branch: $currentBranch"
    Write-Host "Commit: $currentCommit"
    Write-Host "Build Date: $(Get-Date)"
    Write-Host "Package: $packageName"
    Write-Host ""
    
    switch ($DeploymentType) {
        "static" {
            Write-Info "Static Hosting Deployment Selected"
            Write-Host "Frontend build is ready in: frontend\build\"
            Write-Host ""
            Write-Host "For Netlify:"
            Write-Host "- Run: npx netlify-cli deploy --prod --dir=frontend\build"
            Write-Host ""
            Write-Host "For Vercel:"
            Write-Host "- Run: npx vercel --prod frontend\build"
            Write-Host ""
            Write-Host "For GitHub Pages:"
            Write-Host "- Enable GitHub Pages in repository settings"
            Write-Host "- Point to main branch /frontend/build folder"
        }
        "fullstack" {
            Write-Info "Full Stack Hosting Deployment Selected"
            Write-Host "Deployment package ready: $packageName"
            Write-Host ""
            Write-Host "For Heroku:"
            Write-Host "- heroku create nssf-pensioner-portal"
            Write-Host "- heroku addons:create heroku-postgresql:mini"
            Write-Host "- git push heroku main"
            Write-Host ""
            Write-Host "For DigitalOcean:"
            Write-Host "- Upload $packageName to your droplet"
            Write-Host "- Extract and configure environment variables"
            Write-Host "- Start services with PM2 or systemd"
        }
        "docker" {
            Write-Info "Docker Deployment Selected"
            if (Get-Command docker -ErrorAction SilentlyContinue) {
                Write-Info "Building Docker images..."
                docker-compose -f docker-compose.prod.yml build
                if ($LASTEXITCODE -eq 0) {
                    Write-Status "Docker images built successfully"
                    Write-Host ""
                    Write-Host "To deploy:"
                    Write-Host "- docker-compose -f docker-compose.prod.yml up -d"
                } else {
                    Write-Warning "Docker build failed"
                }
            } else {
                Write-Warning "Docker not found. Install Docker first."
            }
        }
        "manual" {
            Write-Info "Manual Deployment Selected"
            Write-Host "Deployment package ready: $packageName"
            Write-Host ""
            Write-Host "Manual steps:"
            Write-Host "1. Upload $packageName to your server"
            Write-Host "2. Extract the zip file"
            Write-Host "3. Configure environment variables"
            Write-Host "4. Set up reverse proxy (nginx/IIS)"
            Write-Host "5. Start services"
        }
    }
    
    Write-Host ""
    Write-Info "NSSF Branding Features:"
    Write-Host "- Official NSSF colors (#003876, #FF6B35)"
    Write-Host "- Professional gradient styling"
    Write-Host "- Enhanced user experience"
    Write-Host "- Institutional trust appearance"
    Write-Host "- Mobile-responsive design"
    Write-Host ""
    
    Write-Info "Security Features:"
    Write-Host "- Admin demo button removed"
    Write-Host "- JWT authentication"
    Write-Host "- CORS protection"
    Write-Host "- Input validation"
    Write-Host "- SQL injection prevention"
    Write-Host ""
    
    Write-Status "NSSF Pensioner Portal deployment preparation completed!"
    Write-Info "See DEPLOYMENT.md for detailed deployment instructions"
    
    Write-Host ""
    Write-Host "🎉 Your NSSF Portal is ready for production deployment!" -ForegroundColor $SuccessColor
    
} catch {
    Write-Error "Deployment preparation failed: $($_.Exception.Message)"
    exit 1
}
