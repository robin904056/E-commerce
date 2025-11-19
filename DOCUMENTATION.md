# E-Commerce Platform - Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [API Documentation](#api-documentation)
5. [Database Schema](#database-schema)
6. [Authentication & Security](#authentication--security)
7. [Deployment](#deployment)
8. [Development Guide](#development-guide)

## Architecture Overview

This is an enterprise-level, monorepo-based E-commerce platform built with:
- **Frontend**: Next.js 14 (React) with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with social auth support
- **Payment**: Razorpay integration
- **Caching**: Redis
- **Real-time**: Socket.io

### System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Customer Web   │     │ Seller Dashboard│     │ Admin Dashboard │
│   (Next.js)     │     │    (Next.js)    │     │   (Next.js)     │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                        │
         └───────────────────────┼────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   API Gateway (Express)  │
                    │  ┌──────────────────┐   │
                    │  │ Rate Limiting    │   │
                    │  │ Authentication   │   │
                    │  │ Authorization    │   │
                    │  └──────────────────┘   │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Database (PostgreSQL)│
                    │     + Redis Cache        │
                    └─────────────────────────┘
```

## Project Structure

```
E-commerce/
├── apps/
│   ├── customer-web/          # Customer-facing website
│   ├── seller-dashboard/      # Seller management panel
│   ├── admin-dashboard/       # Admin management panel
│   ├── delivery-partner/      # Delivery partner app
│   └── api-gateway/           # Backend API service
├── packages/
│   ├── database/              # Prisma schema & client
│   ├── auth/                  # Authentication utilities
│   ├── shared/                # Shared types & validators
│   └── ui/                    # Shared UI components
├── .github/
│   └── workflows/             # CI/CD pipelines
├── package.json               # Root package config
├── .env.example               # Environment variables template
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/robin904056/E-commerce.git
cd E-commerce
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up the database**
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. **Start development servers**
```bash
npm run dev
```

This will start:
- Customer Web: http://localhost:3000
- API Gateway: http://localhost:8000
- Admin Dashboard: http://localhost:3001
- Seller Dashboard: http://localhost:3002

## API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "user": {
    "id": "clx...",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /api/auth/login/email
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### POST /api/auth/login/phone
Login with phone and password.

**Request Body:**
```json
{
  "phone": "+1234567890",
  "password": "SecurePass123"
}
```

#### POST /api/auth/login/otp
Login with OTP (One-Time Password).

**Request Body:**
```json
{
  "identifier": "john@example.com",
  "otp": "123456"
}
```

#### POST /api/auth/otp/send
Send OTP to email or phone.

**Request Body:**
```json
{
  "identifier": "john@example.com",
  "type": "LOGIN"
}
```

#### POST /api/auth/social/:provider
Authenticate with social provider (Google, Facebook).

**Parameters:**
- `provider`: google | facebook

**Request Body:**
```json
{
  "providerId": "123456789",
  "email": "john@example.com",
  "name": "John Doe"
}
```

#### POST /api/auth/password/reset-request
Request password reset.

**Request Body:**
```json
{
  "identifier": "john@example.com"
}
```

#### POST /api/auth/password/reset
Reset password with OTP.

**Request Body:**
```json
{
  "identifier": "john@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123"
}
```

### Product Endpoints

#### GET /api/products
Get all products with pagination and filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category ID
- `search`: Search query
- `sort`: Sort by (price, name, createdAt)
- `order`: Sort order (asc, desc)

#### GET /api/products/:id
Get product details by ID.

#### POST /api/products
Create a new product (Seller only).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "categoryId": "clx...",
  "sku": "SKU-001",
  "price": 999.99,
  "mrp": 1499.99,
  "stock": 100,
  "images": ["url1", "url2"],
  "specifications": [
    { "key": "Color", "value": "Red" }
  ]
}
```

### Order Endpoints

#### GET /api/orders
Get user's orders.

**Headers:**
```
Authorization: Bearer <accessToken>
```

#### POST /api/orders
Create a new order.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "clx...",
      "quantity": 2
    }
  ],
  "shippingAddressId": "clx...",
  "paymentMethod": "razorpay"
}
```

## Database Schema

### Key Models

#### User
- Supports email and phone authentication
- Role-based access control (CUSTOMER, SELLER, ADMIN, DELIVERY_PARTNER)
- Email and phone verification
- Social authentication support

#### Product
- Full product information
- Category association
- Seller relationship
- Stock management
- Image gallery
- Custom specifications

#### Order
- Order lifecycle management
- Payment tracking
- Shipping details
- Order items with pricing snapshot

#### Cart & Wishlist
- User shopping cart
- Product wishlist

See `packages/database/schema.prisma` for complete schema.

## Authentication & Security

### JWT Authentication
- **Access Token**: Short-lived (15 minutes)
- **Refresh Token**: Long-lived (7 days)
- Tokens stored in database for revocation support

### Security Features
1. **Rate Limiting**: 100 requests per 15 minutes per IP
2. **Helmet.js**: Security headers
3. **CORS**: Configured for specific origins
4. **Input Validation**: Zod schema validation
5. **Password Hashing**: bcrypt with salt
6. **OTP Verification**: Time-limited OTPs (10 minutes)

### Rate Limiting Strategy
- Login endpoints: Stricter limits
- Public endpoints: Standard limits
- Authenticated endpoints: Higher limits

### Brute Force Protection
- Failed login attempt tracking
- Account lockout after multiple failures
- IP-based rate limiting

## Deployment

### Environment Variables
Required environment variables are documented in `.env.example`.

### Docker Deployment
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d
```

### Production Checklist
- [ ] Set strong JWT secrets
- [ ] Configure production database
- [ ] Set up Redis cluster
- [ ] Configure payment gateway credentials
- [ ] Set up email/SMS services
- [ ] Enable HTTPS
- [ ] Configure CDN for assets
- [ ] Set up monitoring (Sentry, DataDog)
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Security audit
- [ ] Load testing

## Development Guide

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Database Migrations
```bash
# Create migration
npm run db:migrate

# Apply migration
npm run db:push

# Open Prisma Studio
cd packages/database && npx prisma studio
```

### Adding New Features

1. **Update Database Schema** (`packages/database/schema.prisma`)
2. **Generate Prisma Client** (`npm run db:generate`)
3. **Create/Update API Routes** (`apps/api-gateway/src/routes`)
4. **Add Validation Schemas** (`packages/shared/index.ts`)
5. **Update Frontend** (respective app in `apps/`)
6. **Write Tests**
7. **Update Documentation**

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Conventional commits

### Branching Strategy
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `hotfix/*`: Urgent fixes

## CI/CD Pipeline

GitHub Actions workflow includes:
1. **Lint**: Code quality checks
2. **Test**: Run test suites
3. **Build**: Compile applications
4. **Security Scan**: Vulnerability scanning
5. **Deploy**: Automatic deployment to staging/production

See `.github/workflows/ci-cd.yml` for configuration.

## Support

For issues and feature requests, please use GitHub Issues.

## License

Proprietary - All rights reserved
