# Deployment Guide

This guide covers deploying the E-Commerce platform to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Deployment Options](#deployment-options)
5. [Post-Deployment](#post-deployment)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Services
- PostgreSQL 14+ database
- Redis 6+ instance
- Domain name with SSL certificate
- Cloud storage (AWS S3/Cloudinary)
- Email service (SendGrid/AWS SES)
- SMS service (Twilio/AWS SNS)
- Payment gateway account (Razorpay)

### Required Tools
- Docker & Docker Compose
- Node.js 18+
- Git
- kubectl (for Kubernetes deployment)

## Environment Setup

### 1. Environment Variables

Create a `.env.production` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/ecommerce"

# JWT Secrets (generate strong secrets)
JWT_SECRET="your-strong-secret-key-here"
JWT_REFRESH_SECRET="your-refresh-secret-key-here"

# API URLs
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
NEXT_PUBLIC_WEB_URL="https://www.yourdomain.com"
NEXT_PUBLIC_ADMIN_URL="https://admin.yourdomain.com"
NEXT_PUBLIC_SELLER_URL="https://seller.yourdomain.com"

# Razorpay
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"

# AWS S3
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="ap-south-1"
AWS_BUCKET_NAME="your-bucket"

# Cloudinary (alternative to S3)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
SMTP_FROM="noreply@yourdomain.com"

# SMS
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Redis
REDIS_URL="redis://redis-host:6379"
REDIS_PASSWORD="your-redis-password"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-secret"

# Facebook OAuth
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-secret"

# Monitoring
SENTRY_DSN="your-sentry-dsn"

# Node Environment
NODE_ENV="production"
```

### 2. Generate Secrets

```bash
# Generate strong JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Database Setup

### 1. Create Database

```bash
# Using PostgreSQL CLI
createdb ecommerce

# Or using SQL
CREATE DATABASE ecommerce;
CREATE USER ecommerce_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ecommerce TO ecommerce_user;
```

### 2. Run Migrations

```bash
cd packages/database
npx prisma migrate deploy
npx prisma generate
```

### 3. Seed Initial Data (Optional)

```bash
npx prisma db seed
```

## Deployment Options

### Option 1: Docker Deployment

#### 1. Build Images

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build
```

#### 2. Start Services

```bash
# Start with docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### 3. Nginx Configuration

Create `/etc/nginx/sites-available/ecommerce`:

```nginx
# API Gateway
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Customer Web
server {
    listen 80;
    server_name www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin Dashboard
server {
    listen 80;
    server_name admin.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Seller Dashboard
server {
    listen 80;
    server_name seller.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4. Enable SSL with Certbot

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d api.yourdomain.com
sudo certbot --nginx -d www.yourdomain.com
sudo certbot --nginx -d admin.yourdomain.com
sudo certbot --nginx -d seller.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Option 2: Cloud Platform (Vercel + Railway)

#### 1. Deploy Frontend Apps to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy Customer Web
cd apps/customer-web
vercel --prod

# Deploy Admin Dashboard
cd ../admin-dashboard
vercel --prod

# Deploy Seller Dashboard
cd ../seller-dashboard
vercel --prod
```

#### 2. Deploy API Gateway to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Option 3: Kubernetes Deployment

#### 1. Create Kubernetes Manifests

See `k8s/` directory for full manifests.

```bash
# Apply manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/api-gateway.yaml
kubectl apply -f k8s/customer-web.yaml
kubectl apply -f k8s/admin-dashboard.yaml
kubectl apply -f k8s/seller-dashboard.yaml
kubectl apply -f k8s/ingress.yaml

# Check status
kubectl get pods -n ecommerce
kubectl get services -n ecommerce
```

## Post-Deployment

### 1. Health Checks

```bash
# Check API health
curl https://api.yourdomain.com/health

# Expected response:
# {"status":"ok","timestamp":"2025-01-15T10:30:00.000Z"}
```

### 2. Database Migration Verification

```bash
# Check migrations
npx prisma migrate status

# Verify tables
psql $DATABASE_URL -c "\dt"
```

### 3. Create Admin User

```bash
# Using API endpoint
curl -X POST https://api.yourdomain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@yourdomain.com",
    "password": "SecurePassword123",
    "role": "ADMIN"
  }'
```

### 4. Configure Payment Gateway

1. Log in to Razorpay dashboard
2. Add webhook URL: `https://api.yourdomain.com/api/webhooks/razorpay`
3. Select events: `payment.captured`, `payment.failed`, `refund.created`
4. Copy webhook secret to `.env`

### 5. Set Up Monitoring

```bash
# Configure Sentry
# Add Sentry DSN to environment variables

# Set up CloudWatch/Stackdriver
# Configure log aggregation

# Set up Uptime monitoring
# Use services like UptimeRobot or Pingdom
```

## Monitoring

### Application Monitoring

1. **Sentry** (Error Tracking)
```javascript
// Already integrated in the app
// Check dashboard at sentry.io
```

2. **Application Logs**
```bash
# Docker logs
docker-compose logs -f api-gateway

# Kubernetes logs
kubectl logs -f deployment/api-gateway -n ecommerce
```

3. **Database Monitoring**
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check slow queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

4. **Redis Monitoring**
```bash
redis-cli INFO stats
redis-cli INFO memory
```

### Performance Metrics

Monitor these metrics:
- API response time (target: < 200ms p95)
- Error rate (target: < 0.1%)
- Database query time (target: < 50ms p95)
- Cache hit rate (target: > 80%)
- CPU usage (target: < 70%)
- Memory usage (target: < 80%)

## Backup & Recovery

### Automated Backups

```bash
# PostgreSQL backup script
#!/bin/bash
BACKUP_DIR="/backups/postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="ecommerce_${TIMESTAMP}.sql"

pg_dump $DATABASE_URL > "$BACKUP_DIR/$FILENAME"
gzip "$BACKUP_DIR/$FILENAME"

# Upload to S3
aws s3 cp "$BACKUP_DIR/$FILENAME.gz" s3://your-backup-bucket/

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

### Recovery Procedure

```bash
# Download backup from S3
aws s3 cp s3://your-backup-bucket/ecommerce_YYYYMMDD_HHMMSS.sql.gz .

# Decompress
gunzip ecommerce_YYYYMMDD_HHMMSS.sql.gz

# Restore
psql $DATABASE_URL < ecommerce_YYYYMMDD_HHMMSS.sql
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check database is running
docker-compose ps postgres

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

#### 2. Redis Connection Failed
```bash
# Check Redis is running
docker-compose ps redis

# Test connection
redis-cli -u $REDIS_URL PING
```

#### 3. High Memory Usage
```bash
# Check memory usage
docker stats

# Restart service if needed
docker-compose restart api-gateway
```

#### 4. Application Not Starting
```bash
# Check logs
docker-compose logs api-gateway

# Common issues:
# - Missing environment variables
# - Database not accessible
# - Port already in use
```

### Performance Optimization

1. **Database Indexes**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

2. **Redis Caching**
```javascript
// Cache frequently accessed data
// Set TTL appropriately (e.g., 5 minutes for product lists)
```

3. **CDN Configuration**
- Enable CloudFlare/Cloudfront
- Cache static assets
- Enable compression

## Security Checklist

- [ ] SSL certificates installed and auto-renewing
- [ ] Firewall configured (only necessary ports open)
- [ ] Database not directly accessible from internet
- [ ] Strong passwords for all services
- [ ] Environment variables properly secured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers enabled (Helmet.js)
- [ ] Regular security updates
- [ ] Backup and recovery tested
- [ ] Monitoring and alerts configured
- [ ] Logs properly sanitized (no sensitive data)

## Support

For deployment issues:
- Check logs first
- Review this guide
- Contact DevOps team
- Create GitHub issue if bug found

## Updates and Maintenance

### Rolling Updates

```bash
# Zero-downtime deployment
docker-compose pull
docker-compose up -d --no-deps --build api-gateway

# Kubernetes rolling update
kubectl set image deployment/api-gateway api-gateway=newimage:tag -n ecommerce
```

### Maintenance Windows

Schedule weekly maintenance:
- Database optimization
- Log rotation
- Security updates
- Backup verification
