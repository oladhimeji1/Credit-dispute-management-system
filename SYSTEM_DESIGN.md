# System Design Document
## Credit Dispute Management Platform

### Overview
A comprehensive full-stack credit dispute management platform built with modern technologies, featuring real-time updates, AI-powered tools, and role-based access control.

---

## 1. Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Next.js       │    │   NestJS        │    │   PostgreSQL    │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐             │
         │              │                 │             │
         └──────────────┤     Redis       │─────────────┘
                        │    Session      │
                        │    Storage      │
                        └─────────────────┘
```

### Technology Stack
- **Frontend**: Next.js 13, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: NestJS, TypeScript, TypeORM
- **Database**: PostgreSQL 15
- **Caching**: Redis 7
- **Real-time**: Socket.io WebSockets
- **Authentication**: JWT with refresh tokens
- **Containerization**: Docker & Docker Compose

---

## 2. Authentication & Authorization Flow

### JWT Token Strategy
```
┌─────────────┐    Login     ┌─────────────┐    Verify    ┌─────────────┐
│             │────────────► │             │─────────────► │             │
│   Client    │              │   Backend   │               │  Protected  │
│             │ ◄────────────│             │ ◄─────────────│   Route     │
└─────────────┘  JWT Tokens  └─────────────┘   Success     └─────────────┘
```

### Token Refresh Flow
1. **Access Token**: 15-minute expiration for security
2. **Refresh Token**: 7-day expiration stored in database
3. **Automatic Refresh**: Client-side interceptor handles renewal
4. **Manual Regeneration**: Admin endpoint for token regeneration

### Role-Based Access Control
- **User Role**: Access to personal credit profile, disputes, AI tools
- **Admin Role**: Manage all disputes, view all users, system administration
- **Guard System**: Route-level protection with role validation

---

## 3. Database Design

### Entity Relationship Diagram
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Users       │     │ Credit Profiles │     │    Disputes     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │────►│ id (PK)         │     │ id (PK)         │
│ email           │     │ user_id (FK)    │     │ user_id (FK)    │◄───┤
│ password        │     │ credit_score    │     │ item_name       │    │
│ firstName       │     │ report_date     │     │ item_type       │    │
│ lastName        │     │ open_accounts   │     │ reason          │    │
│ role            │     │ credit_history  │     │ description     │    │
│ refreshToken    │     │ inquiries       │     │ status          │    │
│ created_at      │     │ created_at      │     │ admin_notes     │    │
│ updated_at      │     │ updated_at      │     │ created_at      │    │
└─────────────────┘     └─────────────────┘     │ updated_at      │    │
                                                └─────────────────┘    │
                                                         │              │
                                                         └──────────────┘
```

### Data Storage Strategy
- **Structured Data**: PostgreSQL for relational data (users, disputes)
- **JSON Storage**: PostgreSQL JSONB for flexible credit profile data
- **Session Data**: Redis for JWT refresh tokens and session management
- **File Storage**: Local filesystem for temporary files (future: cloud storage)

---

## 4. Credit Data Integration

### Mock Provider Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Credit Profile │    │   Mock Data     │
│   Request       │───►│    Service      │───►│   Generator     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Mock Data Generation
1. **Credit Score**: Random score between 300-850
2. **Account Data**: Realistic account types with balances
3. **Payment History**: Mixed current and late payment statuses
4. **Credit Inquiries**: Recent hard and soft inquiries
5. **Account Age**: Varied account opening dates

### Future Integration Points
- **Array API**: Credit data provider interface
- **Experian**: Direct bureau integration
- **TransUnion/Equifax**: Multi-bureau support
- **Real-time Updates**: Webhook integration for score changes

---

## 5. Dispute Lifecycle Management

### Status Flow Diagram
```
┌─────────────┐    Create    ┌─────────────┐    Admin     ┌─────────────┐
│   Pending   │─────────────►│  Submitted  │─────────────► │Under Review │
└─────────────┘              └─────────────┘              └─────────────┘
                                     │                             │
                                     │                             ▼
                              ┌─────────────┐              ┌─────────────┐
                              │  Rejected   │◄─────────────┤  Resolved   │
                              └─────────────┘              └─────────────┘
```

### State Management
1. **Pending**: Initial dispute creation
2. **Submitted**: User confirms submission to credit bureaus
3. **Under Review**: Admin/system processing
4. **Resolved**: Dispute successfully completed
5. **Rejected**: Dispute denied with reasoning

### Real-time Notifications
- **WebSocket Events**: Instant status updates
- **User Notifications**: Toast messages for status changes
- **Admin Dashboard**: Real-time dispute queue management

---

## 6. AI Integration Architecture

### AI Letter Generation Flow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Input    │    │   AI Service    │    │   OpenAI API    │
│  (Item Details) │───►│   (NestJS)      │───►│   (Optional)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        │
                       ┌─────────────────┐               │
                       │  Mock Response  │◄──────────────┘
                       │   Generator     │
                       └─────────────────┘
```

### Implementation Strategy
1. **Primary**: Mock AI responses for consistent demo experience
2. **Optional**: Real OpenAI API integration when API key provided
3. **Template System**: Professional dispute letter templates
4. **Customization**: User-specific details injection
5. **Export Options**: Copy to clipboard, download as text file

### Letter Quality Features
- **Legal Compliance**: FCRA-compliant language
- **Professional Tone**: Formal business correspondence style
- **Personalization**: User details and specific dispute information
- **Supporting Documentation**: References to evidence and attachments

---

## 7. Real-time Communication

### WebSocket Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client A      │    │   WebSocket     │    │   Client B      │
│   (User)        │◄──►│   Gateway       │◄──►│   (Admin)       │
└─────────────────┘    │   (Socket.io)   │    └─────────────────┘
                       └─────────────────┘
```

### Event Types
- **disputeUpdate**: Individual user notifications
- **adminDisputeUpdate**: Admin-wide notifications
- **statusChange**: General status messages
- **connectionStatus**: Connection health monitoring

### Room Management
- **User Rooms**: `user:${userId}` for personal notifications
- **Admin Room**: Global admin notifications
- **Connection Tracking**: Socket ID to user ID mapping

---

## 8. Security Implementation

### Authentication Security
- **Password Hashing**: bcrypt with salt rounds
- **JWT Secrets**: Separate secrets for access and refresh tokens
- **Token Rotation**: Automatic refresh token rotation
- **Session Invalidation**: Secure logout with token cleanup

### API Security
- **Rate Limiting**: Throttling to prevent abuse
- **Input Validation**: class-validator for all endpoints
- **CORS Configuration**: Environment-specific allowed origins
- **Role Guards**: Decorator-based authorization

### Data Protection
- **Environment Variables**: Sensitive configuration externalized
- **Database Encryption**: PostgreSQL built-in encryption
- **HTTPS Enforcement**: SSL/TLS in production
- **Audit Logging**: Security event tracking

---

## 9. Performance Optimization

### Backend Performance
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: PostgreSQL connection management
- **Redis Caching**: Session and frequently accessed data
- **Lazy Loading**: On-demand resource loading

### Frontend Performance
- **Next.js Optimization**: Built-in performance features
- **Code Splitting**: Route-based code splitting
- **Static Generation**: Pre-rendered pages where possible
- **Image Optimization**: Responsive images with Next.js

### Monitoring
- **Health Checks**: Application health endpoints
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time monitoring
- **Resource Usage**: Memory and CPU tracking

---

## 10. Deployment Strategy

### Containerization
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   Container     │    │   Container     │    │   Container     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Docker        │
                    │   Compose       │
                    └─────────────────┘
```

### Environment Configuration
- **Development**: Local Docker setup with hot reload
- **Staging**: Production-like environment for testing
- **Production**: Optimized builds with security hardening
- **Environment Variables**: Centralized configuration management

### Scalability Considerations
- **Horizontal Scaling**: Load balancer ready
- **Database Scaling**: Read replicas for high traffic
- **Caching Layer**: Redis cluster for distributed caching
- **CDN Integration**: Static asset delivery optimization

---

## 11. Monitoring & Maintenance

### Health Monitoring
- **Application Health**: Custom health check endpoints
- **Database Health**: Connection and query monitoring
- **Redis Health**: Cache performance metrics
- **WebSocket Health**: Connection status tracking

### Logging Strategy
- **Application Logs**: Structured logging with correlation IDs
- **Access Logs**: Request/response tracking
- **Error Logs**: Exception tracking and alerting
- **Security Logs**: Authentication and authorization events

### Backup & Recovery
- **Database Backups**: Automated PostgreSQL backups
- **Configuration Backups**: Environment and configuration files
- **Disaster Recovery**: Multi-region deployment strategy
- **Data Retention**: Compliance-based data lifecycle

---

## 12. Future Enhancements

### Phase 2 Features
- **PDF Generation**: Dispute letter PDF export
- **Email Integration**: Automated email notifications
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Credit score trend analysis

### Integration Roadmap
- **Real Credit Bureaus**: Direct API integration
- **Payment Processing**: Subscription billing system
- **Document Storage**: Cloud-based file management
- **AI Enhancements**: Advanced dispute analysis

### Scalability Improvements
- **Microservices**: Service decomposition for scale
- **Event Sourcing**: Audit trail and state management
- **API Gateway**: Centralized API management
- **Machine Learning**: Predictive dispute outcomes

---

This system design provides a solid foundation for a production-ready credit dispute management platform while maintaining flexibility for future enhancements and scale requirements.