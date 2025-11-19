# E-Commerce Platform

A comprehensive, enterprise-level E-Commerce platform similar to Amazon/Flipkart, designed to handle all aspects of an online marketplace. Built with modern technologies and best practices for scalability, security, and performance.

## 🚀 Features

### Customer Website
- ✅ **Multi-method Authentication**
  - Email/Phone login with password
  - OTP-based authentication
  - Social login (Google, Facebook)
  - Password recovery with OTP
  - Rate limiting and brute-force protection
  
- 🛍️ **Shopping Experience**
  - Product browsing and search
  - Category-based navigation
  - Shopping cart management
  - Wishlist functionality
  - Product reviews and ratings
  - Dynamic hero banners
  - AI/ML recommendation engine (foundation ready)

- 💳 **Checkout & Payments**
  - Secure checkout flow
  - Multiple payment methods
  - Razorpay integration
  - Order tracking
  - Invoice generation

### Seller Dashboard
- 📦 **Inventory Management**
  - Product listing and management
  - Stock tracking
  - Bulk product upload
  - Product approval workflow

- 💰 **Financial Management**
  - Commission calculation
  - Order status tracking
  - Sales analytics
  - Payment reconciliation

### Admin Dashboard
- 📊 **System Management**
  - User management
  - Product approval workflow
  - Order management
  - System reports and analytics
  - Category management

### Delivery Partner Panel
- 🚚 **Delivery Operations**
  - Order assignment
  - Delivery tracking
  - Route optimization (foundation ready)
  - Delivery status updates

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **Authentication**: JWT-based with refresh tokens
- **Payment**: Razorpay integration
- **Real-time**: Socket.io (ready for integration)
- **File Storage**: Cloudinary/AWS S3 (configured)

### Project Structure
```
E-commerce/
├── apps/
│   ├── customer-web/          # Customer-facing website (Next.js)
│   ├── seller-dashboard/      # Seller management panel
│   ├── admin-dashboard/       # Admin management panel
│   ├── delivery-partner/      # Delivery partner app
│   └── api-gateway/           # Backend API service (Express)
├── packages/
│   ├── database/              # Prisma schema & database client
│   ├── auth/                  # Authentication utilities (JWT, bcrypt)
│   ├── shared/                # Shared types & Zod validators
│   └── ui/                    # Shared UI components
└── .github/
    └── workflows/             # CI/CD pipelines
```

## 📋 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- npm or yarn

### Quick Start

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

### Access Points
- **Customer Web**: http://localhost:3000
- **API Gateway**: http://localhost:8000
- **Admin Dashboard**: http://localhost:3001
- **Seller Dashboard**: http://localhost:3002

## 🔐 Security Features

- **Rate Limiting**: Protection against brute-force attacks
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Zod schema validation on all endpoints
- **Password Hashing**: bcrypt with salt
- **OTP Verification**: Time-limited OTPs for critical operations
- **CORS Configuration**: Restricted origin access
- **Helmet.js**: Security headers
- **SQL Injection Protection**: Prisma ORM with parameterized queries

## 🚀 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Login with Email
```http
POST /api/auth/login/email
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Login with OTP
```http
POST /api/auth/login/otp
Content-Type: application/json

{
  "identifier": "john@example.com",
  "otp": "123456"
}
```

#### Social Authentication
```http
POST /api/auth/social/google
Content-Type: application/json

{
  "providerId": "google-user-id",
  "email": "john@example.com",
  "name": "John Doe"
}
```

See [DOCUMENTATION.md](./DOCUMENTATION.md) for complete API reference.

## 📦 Database Schema

The platform uses a comprehensive database schema with:
- **User Management**: Multi-role support (Customer, Seller, Admin, Delivery Partner)
- **Product Catalog**: Categories, specifications, images
- **Order Management**: Full order lifecycle
- **Cart & Wishlist**: Shopping cart and wishlist
- **Reviews & Ratings**: Product reviews with verification
- **Delivery Tracking**: Real-time delivery status
- **Authentication**: Sessions, OTPs, social auth

See `packages/database/schema.prisma` for the complete schema.

## 🔄 CI/CD Pipeline

Automated CI/CD pipeline with GitHub Actions:
- ✅ Code linting
- ✅ Automated testing
- ✅ Security scanning
- ✅ Build verification
- ✅ Automated deployment (staging/production)

## 🐳 Docker Support

Run the entire platform with Docker:
```bash
docker-compose up -d
```

## 📚 Documentation

- [Complete Documentation](./DOCUMENTATION.md)
- [API Reference](./DOCUMENTATION.md#api-documentation)
- [Database Schema](./packages/database/schema.prisma)
- [Development Guide](./DOCUMENTATION.md#development-guide)

## 🛠️ Development

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
npm run db:migrate
npm run db:push
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Proprietary - All rights reserved

## 🙋‍♂️ Support

For issues and feature requests, please use [GitHub Issues](https://github.com/robin904056/E-commerce/issues).
