# System Architecture

## Overview
This document describes the architecture of the E-Commerce platform, including system components, data flow, and deployment architecture.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Client Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Customer    │  │   Seller     │  │    Admin     │              │
│  │  Web App     │  │  Dashboard   │  │  Dashboard   │              │
│  │  (Next.js)   │  │  (Next.js)   │  │  (Next.js)   │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
└─────────┼──────────────────┼──────────────────┼────────────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
┌─────────────────────────────┼─────────────────────────────────────┐
│                        API Layer                                   │
│                  ┌────────────▼───────────┐                        │
│                  │   API Gateway (Express) │                       │
│                  │  ┌─────────────────┐   │                       │
│                  │  │  Rate Limiter   │   │                       │
│                  │  └─────────────────┘   │                       │
│                  │  ┌─────────────────┐   │                       │
│                  │  │   Auth Guard    │   │                       │
│                  │  └─────────────────┘   │                       │
│                  │  ┌─────────────────┐   │                       │
│                  │  │   Validation    │   │                       │
│                  │  └─────────────────┘   │                       │
│                  └────────────┬───────────┘                        │
└──────────────────────────────┼────────────────────────────────────┘
                               │
    ┌──────────────────────────┼──────────────────────────┐
    │                          │                          │
┌───▼───────────┐    ┌─────────▼──────────┐    ┌────────▼──────┐
│   Database    │    │   Cache Layer      │    │  File Storage │
│  (PostgreSQL) │    │    (Redis)         │    │  (Cloudinary) │
└───────────────┘    └────────────────────┘    └───────────────┘
```

## Component Architecture

### 1. Frontend Applications

#### Customer Web App (Port 3000)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Key Features**:
  - Server-side rendering for SEO
  - Client-side navigation
  - Authentication flows
  - Product catalog
  - Shopping cart
  - Checkout process

#### Seller Dashboard (Port 3002)
- **Framework**: Next.js 14
- **Features**:
  - Product management
  - Inventory tracking
  - Order fulfillment
  - Analytics dashboard
  - Commission tracking

#### Admin Dashboard (Port 3001)
- **Framework**: Next.js 14
- **Features**:
  - User management
  - Seller verification
  - Product approval
  - System reports
  - Platform analytics

### 2. Backend Services

#### API Gateway (Port 8000)
- **Framework**: Express.js with TypeScript
- **Architecture**: REST API
- **Key Components**:
  - **Authentication Service**: JWT-based auth with refresh tokens
  - **Product Service**: Product CRUD operations
  - **Order Service**: Order management
  - **User Service**: User profile management
  - **Payment Service**: Payment processing

**Middleware Stack**:
```javascript
Request → CORS → Helmet → Rate Limiter → Body Parser → 
  Authentication → Authorization → Route Handler → Response
```

### 3. Data Layer

#### PostgreSQL Database
**Schema Organization**:
- **User Management**: Users, Sessions, OTPVerification, SocialAuth
- **Product Catalog**: Products, Categories, Specifications
- **Shopping**: Cart, CartItems, Wishlist
- **Orders**: Orders, OrderItems, Delivery
- **Seller**: SellerProfile
- **Reviews**: Reviews

**Key Relationships**:
```
User 1→N Orders
User 1→N Reviews
User 1→1 Cart
User 1→1 SellerProfile
Product N→1 Category
Product N→1 Seller
Order 1→N OrderItems
Order 1→1 Delivery
```

#### Redis Cache
**Usage**:
- Session storage
- Rate limiting counters
- Product cache
- Cart data (temporary)
- OTP storage

### 4. External Services

#### Payment Gateway (Razorpay)
- Payment processing
- Refund handling
- Webhook integration

#### Email/SMS Service
- OTP delivery
- Order confirmations
- Marketing emails

#### File Storage (Cloudinary/AWS S3)
- Product images
- User avatars
- Document storage

## Data Flow

### Authentication Flow

```
1. User Login Request
   ↓
2. API Gateway validates credentials
   ↓
3. Check user in PostgreSQL
   ↓
4. Generate JWT tokens
   ↓
5. Store session in Redis + PostgreSQL
   ↓
6. Return tokens to client
   ↓
7. Client stores tokens
   ↓
8. Subsequent requests include token in header
```

### Order Placement Flow

```
1. User adds products to cart → Stored in Redis + PostgreSQL
   ↓
2. User initiates checkout
   ↓
3. API validates cart items and inventory
   ↓
4. Calculate pricing (subtotal, tax, shipping)
   ↓
5. Create pending order in PostgreSQL
   ↓
6. Initiate payment with Razorpay
   ↓
7. Payment success webhook
   ↓
8. Update order status
   ↓
9. Reduce product inventory
   ↓
10. Create delivery record
   ↓
11. Send confirmation email/SMS
   ↓
12. Clear cart
```

### Product Search Flow

```
1. User search query
   ↓
2. Check Redis cache for popular searches
   ↓
3. If not cached, query PostgreSQL with filters
   ↓
4. Apply pagination
   ↓
5. Cache results in Redis (TTL: 5 minutes)
   ↓
6. Return paginated results
```

## Security Architecture

### Authentication & Authorization
1. **JWT Tokens**:
   - Access Token: 15 minutes expiry
   - Refresh Token: 7 days expiry
   - Stored in httpOnly cookies (frontend) or localStorage

2. **Password Security**:
   - bcrypt hashing with salt rounds: 10
   - Minimum 8 characters
   - No password history stored in plain text

3. **OTP Security**:
   - 6-digit random OTP
   - 10-minute expiry
   - Rate limited (max 3 attempts per hour)

### API Security
1. **Rate Limiting**:
   - 100 requests/15 minutes per IP
   - Stricter limits on auth endpoints

2. **Input Validation**:
   - Zod schema validation
   - SQL injection prevention via Prisma
   - XSS protection

3. **Headers**:
   - Helmet.js security headers
   - CORS configured for specific origins
   - Content Security Policy

### Data Security
1. **Database**:
   - Encrypted connections (SSL/TLS)
   - Regular backups
   - Role-based access control

2. **Sensitive Data**:
   - No credit card storage (PCI compliance)
   - Payment tokens only from gateway
   - Personal data encryption at rest

## Scalability Considerations

### Horizontal Scaling
- **API Gateway**: Stateless design allows multiple instances
- **Database**: Read replicas for read-heavy operations
- **Cache**: Redis cluster for high availability

### Vertical Scaling
- Database connection pooling
- Efficient indexes on frequently queried columns
- Query optimization

### Performance Optimization
1. **Caching Strategy**:
   - Static assets: CDN
   - API responses: Redis (short TTL)
   - Database queries: Connection pooling

2. **Database**:
   - Indexes on foreign keys
   - Composite indexes for common queries
   - Pagination for large datasets

3. **Frontend**:
   - Next.js SSG for static pages
   - ISR for dynamic content
   - Image optimization

## Deployment Architecture

### Development Environment
```
Local Machine
├── PostgreSQL (Docker)
├── Redis (Docker)
├── API Gateway (port 8000)
├── Customer Web (port 3000)
├── Seller Dashboard (port 3002)
└── Admin Dashboard (port 3001)
```

### Production Environment
```
Cloud Provider (AWS/GCP/Azure)
├── Load Balancer (HTTPS)
│   ├── API Gateway (Auto-scaling group)
│   ├── Customer Web (Vercel/Cloudflare)
│   ├── Seller Dashboard (Vercel/Cloudflare)
│   └── Admin Dashboard (Vercel/Cloudflare)
├── Database Cluster (RDS/Cloud SQL)
│   ├── Primary (Write)
│   └── Read Replicas (Read)
├── Redis Cluster (ElastiCache/MemoryStore)
├── File Storage (S3/Cloud Storage)
└── Monitoring (CloudWatch/Stackdriver)
```

### CI/CD Pipeline
```
GitHub Push
    ↓
GitHub Actions
    ↓
├── Lint & Test
├── Security Scan
├── Build
└── Deploy
    ├── Staging (develop branch)
    └── Production (main branch)
```

## Monitoring & Observability

### Logging
- Application logs: Winston/Pino
- Access logs: Morgan
- Error tracking: Sentry

### Metrics
- API response times
- Database query performance
- Cache hit/miss ratios
- Error rates

### Alerts
- High error rates
- Slow API responses
- Database connection issues
- Payment failures

## Disaster Recovery

### Backup Strategy
1. **Database**:
   - Automated daily backups
   - Point-in-time recovery
   - Backup retention: 30 days

2. **Files**:
   - Replicated across regions
   - Versioning enabled

### Recovery Procedures
1. Database failure: Promote read replica
2. API Gateway failure: Auto-scaling brings up new instances
3. Complete region failure: Failover to backup region

## Future Enhancements

1. **Microservices Architecture**:
   - Split API Gateway into separate services
   - Service mesh for inter-service communication

2. **Real-time Features**:
   - WebSocket for live order tracking
   - Real-time inventory updates
   - Chat support

3. **AI/ML Integration**:
   - Recommendation engine
   - Fraud detection
   - Dynamic pricing

4. **Mobile Apps**:
   - React Native apps
   - Push notifications
   - Offline support

5. **Analytics**:
   - Data warehouse
   - Business intelligence tools
   - A/B testing framework
