# NSSF Pensioner Self-Service Portal

A comprehensive, secure web platform designed for NSSF retirees to access pension services, manage their accounts, and communicate with NSSF support staff.

## 🎯 Project Overview

The NSSF Pensioner Self-Service Portal provides:

- **Secure Authentication**: Multi-factor authentication with robust security
- **Pension Management**: View benefits, payment history, and statements
- **Profile Management**: Update personal and banking information
- **Communication Hub**: Secure messaging with NSSF support
- **Accessibility**: WCAG 2.1 compliant design
- **Mobile Responsive**: Optimized for all devices

## 🏗️ Architecture

### Frontend

- **React 18** with TypeScript
- **Material-UI (MUI)** for consistent design
- **React Router** for navigation
- **Axios** for API communication
- **React Query** for data management

### Backend

- **Node.js** with Express.js
- **TypeScript** for type safety
- **JWT** authentication with refresh tokens
- **bcrypt** for password hashing
- **Rate limiting** and security middleware

### Database

- **PostgreSQL** with comprehensive schema
- **Prisma ORM** for database management
- **Redis** for session management and caching

### Security Features

- End-to-end encryption
- Multi-factor authentication (MFA)
- Role-based access control (RBAC)
- Security audit logging
- CSRF protection
- SQL injection prevention

## 📁 Project Structure

```
nssf-pensioner-portal/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service functions
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript type definitions
│   │   └── styles/          # Global styles and themes
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Database models (Prisma)
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic services
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript type definitions
│   ├── prisma/              # Database schema and migrations
│   └── package.json
├── database/                # Database setup and documentation
│   ├── schema.sql           # Database schema
│   ├── seed-data.sql        # Sample data for development
│   └── migrations/          # Database migration scripts
├── docs/                    # Project documentation
│   ├── api/                 # API documentation
│   ├── security/            # Security guidelines
│   └── deployment/          # Deployment guides
├── docker/                  # Docker configuration
│   ├── docker-compose.yml
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis (optional, for production)

### Installation

1. **Clone and setup project**:

   ```bash
   git clone <repository-url>
   cd NSSFPensioner
   npm run setup
   ```

2. **Configure environment**:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   # Edit the .env files with your actual configuration
   ```

3. **Setup database**:

   ```bash
   npm run db:setup
   ```

4. **Start development servers**:
   ```bash
   npm run dev
   ```

### Access Points

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

### Test Accounts

After running the seed script:

- Admin: `admin` / `admin123`
- Pensioner: `john.mukasa` / `pensioner123`

📖 **Detailed installation guide**: [docs/INSTALLATION.md](docs/INSTALLATION.md)

## 🔐 Security Features

### Authentication & Authorization

- JWT-based authentication with refresh tokens
- Multi-factor authentication (SMS/Email)
- Role-based access control (Pensioner, Admin, Support)
- Session management with automatic logout

### Data Protection

- All sensitive data encrypted at rest and in transit
- HTTPS enforcement in production
- Input validation and sanitization
- SQL injection prevention with parameterized queries

### Compliance

- WCAG 2.1 AA accessibility compliance
- Uganda Data Protection Act compliance
- Regular security audits and penetration testing

## 🏥 Health Monitoring

- Application performance monitoring
- Database query optimization
- Error tracking and logging
- Uptime monitoring

## 📱 Key Features

### For Pensioners

- **Dashboard**: Overview of pension status and recent activity
- **Pension Information**: Detailed benefit information and payment history
- **Profile Management**: Update personal and banking details securely
- **Document Center**: Download pension statements and certificates
- **Support Center**: FAQs, help guides, and secure messaging

### For Administrators

- **User Management**: Monitor and manage pensioner accounts
- **Payment Processing**: Process and track pension payments
- **Reporting**: Generate comprehensive reports and analytics
- **Security Monitoring**: Track and investigate security events

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is proprietary to the National Social Security Fund (NSSF) Uganda.

## 🤝 Contributing

Please refer to the [Contributing Guidelines](docs/CONTRIBUTING.md) for development standards and procedures.

## 📞 Support

For technical support, contact the NSSF IT Department:
###############################################

---

**Built with ❤️ for NSSF Uganda Pensioners**
