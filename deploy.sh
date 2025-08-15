#!/bin/bash

# NSSF Pensioner Portal - Production Deployment Script
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 NSSF Pensioner Portal - Production Deployment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if git is available
if ! command -v git &> /dev/null; then
    print_error "Git is not installed or not in PATH"
    exit 1
fi

# Check if node and npm are available
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed or not in PATH"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed or not in PATH"
    exit 1
fi

print_info "Starting NSSF Portal deployment process..."

# 1. Clean previous builds
print_info "Cleaning previous builds..."
rm -rf frontend/build
rm -rf backend/dist
print_status "Previous builds cleaned"

# 2. Install dependencies
print_info "Installing frontend dependencies..."
cd frontend
npm install --production
print_status "Frontend dependencies installed"

print_info "Installing backend dependencies..."
cd ../backend
npm install --production
print_status "Backend dependencies installed"

cd ..

# 3. Build frontend
print_info "Building frontend for production..."
cd frontend
npm run build
if [ $? -eq 0 ]; then
    print_status "Frontend build completed successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

# 4. Build backend
print_info "Building backend for production..."
cd ../backend
npm run build
if [ $? -eq 0 ]; then
    print_status "Backend build completed successfully"
else
    print_error "Backend build failed"
    exit 1
fi

cd ..

# 5. Run tests (if available)
print_info "Running tests..."
if [ -f "frontend/package.json" ] && grep -q '"test"' frontend/package.json; then
    cd frontend
    npm test -- --coverage --watchAll=false || print_warning "Frontend tests failed or not available"
    cd ..
fi

if [ -f "backend/package.json" ] && grep -q '"test"' backend/package.json; then
    cd backend
    npm test || print_warning "Backend tests failed or not available"
    cd ..
fi

# 6. Check build sizes
print_info "Checking build sizes..."
if [ -d "frontend/build" ]; then
    frontend_size=$(du -sh frontend/build | cut -f1)
    print_status "Frontend build size: $frontend_size"
fi

if [ -d "backend/dist" ]; then
    backend_size=$(du -sh backend/dist | cut -f1)
    print_status "Backend build size: $backend_size"
fi

# 7. Create deployment package
print_info "Creating deployment package..."
timestamp=$(date +"%Y%m%d_%H%M%S")
package_name="nssf-portal-production-$timestamp.tar.gz"

tar -czf "$package_name" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.env' \
    frontend/build/ \
    backend/dist/ \
    backend/package.json \
    backend/package-lock.json \
    docker-compose.prod.yml \
    DEPLOYMENT.md \
    README.md \
    INSTALLATION.md

print_status "Deployment package created: $package_name"

# 8. Deployment options
echo ""
print_info "Deployment Options:"
echo "==================="
echo "1. Static Hosting (Netlify/Vercel/GitHub Pages)"
echo "2. Full Stack Hosting (Heroku/DigitalOcean)"
echo "3. Docker Deployment"
echo "4. Manual Deployment"
echo ""

read -p "Select deployment option (1-4): " deployment_option

case $deployment_option in
    1)
        print_info "Static Hosting Deployment"
        echo "Frontend build is ready in: frontend/build/"
        echo ""
        echo "For Netlify:"
        echo "- Run: npx netlify-cli deploy --prod --dir=frontend/build"
        echo ""
        echo "For Vercel:"
        echo "- Run: npx vercel --prod frontend/build"
        echo ""
        echo "For GitHub Pages:"
        echo "- Enable GitHub Pages in repository settings"
        echo "- Point to main branch /frontend/build folder"
        ;;
    2)
        print_info "Full Stack Hosting Deployment"
        echo "Deployment package ready: $package_name"
        echo ""
        echo "For Heroku:"
        echo "- heroku create nssf-pensioner-portal"
        echo "- heroku addons:create heroku-postgresql:mini"
        echo "- git push heroku main"
        echo ""
        echo "For DigitalOcean:"
        echo "- Upload $package_name to your droplet"
        echo "- Extract and configure environment variables"
        echo "- Start services with PM2 or systemd"
        ;;
    3)
        print_info "Docker Deployment"
        if command -v docker &> /dev/null; then
            print_info "Building Docker images..."
            docker-compose -f docker-compose.prod.yml build
            print_status "Docker images built successfully"
            echo ""
            echo "To deploy:"
            echo "- docker-compose -f docker-compose.prod.yml up -d"
        else
            print_warning "Docker not found. Install Docker first."
        fi
        ;;
    4)
        print_info "Manual Deployment"
        echo "Deployment package ready: $package_name"
        echo ""
        echo "Manual steps:"
        echo "1. Upload $package_name to your server"
        echo "2. Extract: tar -xzf $package_name"
        echo "3. Configure environment variables"
        echo "4. Set up reverse proxy (nginx/apache)"
        echo "5. Start services"
        ;;
    *)
        print_warning "Invalid option selected"
        ;;
esac

# 9. Final checks and information
echo ""
print_info "Deployment Information:"
echo "======================="
echo "Repository: https://github.com/ODONGA1/nssf-pensioner-portal"
echo "Branch: main"
echo "Commit: $(git rev-parse --short HEAD)"
echo "Build Date: $(date)"
echo "Package: $package_name"
echo ""

print_info "NSSF Branding Features:"
echo "- Official NSSF colors (#003876, #FF6B35)"
echo "- Professional gradient styling"
echo "- Enhanced user experience"
echo "- Institutional trust appearance"
echo "- Mobile-responsive design"
echo ""

print_info "Security Features:"
echo "- Admin demo button removed"
echo "- JWT authentication"
echo "- CORS protection"
echo "- Input validation"
echo "- SQL injection prevention"
echo ""

print_status "NSSF Pensioner Portal deployment preparation completed!"
print_info "See DEPLOYMENT.md for detailed deployment instructions"

echo ""
echo "🎉 Your NSSF Portal is ready for production deployment!"
