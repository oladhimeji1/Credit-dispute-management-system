# Credit Dispute Management Platform

A comprehensive full-stack application for managing credit disputes, featuring real-time updates, AI-powered letter generation, and role-based access control.

## 🚀 Features

### Core Features
- **JWT Authentication** with refresh token system and role-based access (user/admin)
- **Credit Profile Management** with mock third-party integration simulation
- **Complete Dispute Lifecycle** - create, review, approve/reject disputes
- **AI-Powered Dispute Letters** with OpenAI integration (mock responses included)
- **Real-time Updates** via WebSockets for instant status notifications
- **Role-based Dashboards** with tailored user experiences
- **Responsive Design** optimized for desktop and mobile devices

### Technical Features
- **Backend**: NestJS with TypeScript, PostgreSQL, Redis
- **Frontend**: Next.js 13 with React, Tailwind CSS, shadcn/ui
- **Authentication**: JWT with automatic refresh, role-based guards
- **Real-time**: WebSocket integration for live updates
- **Database**: PostgreSQL with TypeORM, automated migrations
- **Caching**: Redis for session management and performance
- **Containerization**: Full Docker setup with docker-compose

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

## 🛠 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd credit-dispute-platform
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env file with your configuration
```

### 3. Docker Setup (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### 4. Local Development Setup
```bash
# Install dependencies for both frontend and backend
npm run setup

# Start both services concurrently
npm run dev
```

## 🔑 Sample Credentials

### Admin Account
- Email: `admin@creditveto.com`
- Password: `admin123`

### User Accounts
- Email: `john.doe@example.com` / Password: `user123`
- Email: `jane.smith@example.com` / Password: `user123`

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `POST /auth/regenerate-token` - Manual token regeneration
- `POST /auth/logout` - User logout

### Credit Profile Endpoints
- `GET /credit-profile/:userId` - Get user's credit profile

### Dispute Endpoints
- `POST /disputes/create` - Create new dispute
- `GET /disputes/history` - Get dispute history
- `PUT /disputes/:id/status` - Update dispute status (admin only)

### AI Endpoints
- `POST /ai/generate-letter` - Generate dispute letter

## 🏗 Architecture

### Backend Architecture
```
backend/
├── src/
│   ├── auth/          # Authentication module
│   ├── users/         # User management
│   ├── credit-profile/ # Credit data management
│   ├── disputes/      # Dispute lifecycle
│   ├── ai/           # AI letter generation
│   ├── websocket/    # Real-time communication
│   └── database/     # Database configuration
```

### Frontend Architecture
```
app/
├── (auth)/           # Authentication pages
├── dashboard/        # Main dashboard
├── profile/         # Credit profile page
├── disputes/        # Dispute management
├── ai/             # AI letter generator
├── components/     # Reusable UI components
└── lib/           # Utilities and contexts
```

## 🔒 Security Features

- JWT token-based authentication with automatic refresh
- Role-based access control (user/admin)
- Password hashing with bcrypt
- CORS protection
- Rate limiting with throttling
- Input validation and sanitization
- Secure WebSocket connections

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm run test
npm run test:e2e
npm run test:cov
```

### Run Frontend Tests
```bash
cd frontend
npm run test
```

## 🚀 Deployment

### Production Docker Build
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production environment
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
Key environment variables for production:
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - Refresh token secret
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `OPENAI_API_KEY` - OpenAI API key (optional)

## 🔧 Development

### Adding New Features
1. Backend: Create new modules in `backend/src/`
2. Frontend: Add pages in `app/` or components in `components/`
3. Database: Create migrations in `backend/src/database/migrations/`

### Database Migrations
```bash
cd backend
npm run migration:generate -- -n MigrationName
npm run migration:run
```

### Code Quality
- ESLint and Prettier configured
- TypeScript strict mode enabled
- Automated testing with Jest

## 📊 Mock Data

The application includes comprehensive mock data:
- **Credit Profiles**: Sample credit scores, accounts, and history
- **Disputes**: Example dispute cases with various statuses
- **Users**: Pre-configured admin and user accounts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
1. Check the documentation above
2. Review the code comments and TypeScript types
3. Check Docker logs: `docker-compose logs -f`
4. Ensure all environment variables are set correctly

## 🎯 Future Enhancements

- PDF generation for dispute letters
- Email notifications
- Advanced analytics dashboard
- Mobile application
- Third-party credit bureau integrations
- Automated dispute tracking