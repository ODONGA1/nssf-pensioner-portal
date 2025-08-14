# GitHub Pages Deployment Scripts for NSSF Pensioner Portal

## Option 1: Frontend-Only GitHub Pages Deployment

### Prerequisites

1. Your code must be pushed to GitHub
2. GitHub Pages must be enabled in repository settings

### Step 1: Install gh-pages package

```bash
cd frontend
npm install --save-dev gh-pages
```

### Step 2: Update frontend/package.json

Add these scripts and homepage field:

```json
{
  "homepage": "https://YOUR-USERNAME.github.io/nssf-pensioner-portal",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### Step 3: Build and Deploy

```bash
cd frontend
npm run build
npm run deploy
```

### Step 4: Configure for Mock Data

Since GitHub Pages can't host the backend, ensure all download functions work with mock data (they already do!).

## Option 2: Full-Stack Deployment Alternatives

### Vercel (Recommended for Full-Stack)

```bash
npm install -g vercel
vercel --prod
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Railway (Database + Backend)

```bash
npm install -g @railway/cli
railway login
railway deploy
```

### Heroku

```bash
# Install Heroku CLI, then:
heroku create nssf-pensioner-portal
git push heroku main
```

## Configuration Changes Needed

### For GitHub Pages (Frontend-Only):

1. Set homepage in package.json
2. Use HashRouter instead of BrowserRouter
3. Ensure all downloads use mock data
4. Remove backend API calls or make them optional

### For Full-Stack Hosting:

1. Use environment variables for database
2. Set up PostgreSQL database (free tiers available)
3. Configure CORS for production domain
4. Set up CI/CD pipeline

## Current Project Status:

✅ React frontend ready for GitHub Pages
✅ All download features work with mock data
✅ Professional NSSF styling and branding
⚠️ Backend requires separate hosting service

## Recommendation:

Start with GitHub Pages for frontend demo, then move to Vercel/Railway for full-stack deployment.
