# NSSF Pensioner Self-Service Portal - Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher)
- **npm** (version 8 or higher)
- **PostgreSQL** (version 14 or higher)
- **Git**
- **Docker** (optional, for containerized deployment)

## Quick Start (Development)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nssf-pensioner-portal
```

### 2. Install Dependencies

```bash
# Install all dependencies (frontend and backend)
npm run install:all
```

### 3. Database Setup

#### Option A: Local PostgreSQL

1. Create a PostgreSQL database named `nssf_pensioner_db`
2. Create a user with appropriate permissions
3. Update the `DATABASE_URL` in `backend/.env`

#### Option B: Docker PostgreSQL

```bash
docker run --name nssf-postgres \
  -e POSTGRES_DB=nssf_pensioner_db \
  -e POSTGRES_USER=nssf_user \
  -e POSTGRES_PASSWORD=secure_password \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 4. Environment Configuration

#### Backend Configuration

```bash
cd backend
cp .env.example .env
# Edit .env with your actual configuration values
```

#### Frontend Configuration

```bash
cd frontend
cp .env.example .env
# Edit .env with your actual configuration values
```

### 5. Database Migration and Seeding

```bash
cd backend
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 6. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# OR start individually
npm run dev:backend  # Backend on http://localhost:5000
npm run dev:frontend # Frontend on http://localhost:3000
```

## Docker Deployment

### Development with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Production with Docker

```bash
# Start production services (includes Nginx)
docker-compose --profile production up -d
```

## Available Scripts

### Root Level Scripts

- `npm run setup` - Install all dependencies and build
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build:all` - Build both frontend and backend
- `npm run test` - Run all tests
- `npm run lint` - Lint all code

### Backend Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run test` - Run backend tests
- `npm run db:setup` - Setup database schema and seed data

### Frontend Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run frontend tests
- `npm run lint` - Lint frontend code

## Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/nssf_pensioner_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
PORT=5000
NODE_ENV="development"
REDIS_HOST="localhost"
REDIS_PORT=6379
CORS_ORIGIN="http://localhost:3000"
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_NAME="NSSF Pensioner Portal"
REACT_APP_ENABLE_MFA=true
```

## Default User Accounts

After running the seed script, you can login with these test accounts:

**Admin User:**

- Username: `admin`
- Password: `admin123`

**Support Staff:**

- Username: `support1`
- Password: `support123`

**Pensioner Users:**

- Username: `john.mukasa` | Password: `pensioner123`
- Username: `mary.ssemakula` | Password: `pensioner123`
- Username: `david.okello` | Password: `pensioner123`

⚠️ **Important:** Change all default passwords before deploying to production!

## API Documentation

Once the backend is running, visit:

- API Documentation: http://localhost:5000/api-docs
- Health Check: http://localhost:5000/health

## Troubleshooting

### Database Connection Issues

1. Ensure PostgreSQL is running
2. Verify database credentials in `.env`
3. Check if the database exists
4. Ensure the user has proper permissions

### Port Conflicts

- Frontend default port: 3000
- Backend default port: 5000
- PostgreSQL default port: 5432
- Redis default port: 6379

Change ports in environment files if conflicts occur.

### Permission Issues

Ensure the application has proper permissions to:

- Read/write to upload directories
- Connect to database
- Bind to specified ports

## Support

For technical support:

- Email: it-support@nssfug.org
- Phone: +256 312 234 400

## Security Considerations

1. Change all default passwords
2. Use strong JWT secrets
3. Enable HTTPS in production
4. Configure proper firewall rules
5. Regular security updates
6. Enable database encryption
7. Implement proper backup procedures
