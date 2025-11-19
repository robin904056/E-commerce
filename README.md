# E-commerce Platform

## Documentation
This document provides the complete setup instructions for the E-commerce platform.

### Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/robin904056/E-commerce.git
   cd E-commerce
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   - Update the `schema.prisma` file with your database configuration.
   ```bash
   npx prisma migrate dev
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Access the application in your browser:
   - For web clients: http://localhost:3000
   - For admin dashboard: http://localhost:3001
   - For seller dashboard: http://localhost:3002
  
### File Structure
- **apps/** - Contains different applications (web, admin, seller, API)
- **packages/** - Contains shared resources and database schema
- **docs/** - Contains API documentation and setup instructions

### Requirements
- Node.js v14 or later
- MongoDB/PostgreSQL/MySQL

### Deployment
Refer to [DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions.

### API Documentation
Refer to [API.md](docs/API.md) for complete API documentation.
