# BUILD-SETU Backend API

A production-ready backend API for BUILD-SETU, a hyperlocal marketplace for construction materials in Gwalior, India.

## Features

- **Authentication**: Email + password authentication with JWT tokens
- **User Management**: Buyer/Seller/Admin roles with profile management
- **Product Catalog**: Categories and products with search and filtering
- **Order Management**: Complete order lifecycle with transaction support
- **Address Management**: User address management with validation
- **Support System**: Ticket-based customer support with messaging
- **Security**: Input validation, role-based access control, CORS, Helmet

## Tech Stack

- **Runtime**: Node.js (latest LTS)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Supabase Postgres (managed) with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod schema validation
- **Testing**: Jest with ts-jest
- **Linting**: ESLint + Prettier

## Prerequisites

 Node.js 18+ 
 Supabase account and project (Postgres)
 npm or pnpm

## Installation

1. **Clone and install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Fill SUPABASE_PROJECT_REF, SUPABASE_DB_PASSWORD, SUPABASE_URL, and JWT_SECRET
   ```

3. **Set up database**
```bash
npm run migrate
npm run generate
```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - List products (public)
- `GET /api/products/:id` - Get product details (public)
- `POST /api/products` - Create product (seller/admin)
- `PUT /api/products/:id` - Update product (seller/admin)
- `DELETE /api/products/:id` - Delete product (seller/admin)
- `GET /api/products/categories` - List categories
- `GET /api/products/categories/:slug` - Get category by slug

### Addresses
- `GET /api/addresses` - List user addresses
- `GET /api/addresses/:id` - Get address details
- `POST /api/addresses` - Create address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### Orders
- `GET /api/orders` - List user orders (buyer/admin)
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (admin)

### Support
- `GET /api/support` - List support tickets
- `GET /api/support/:id` - Get ticket details
- `POST /api/support` - Create support ticket
- `POST /api/support/:id/messages` - Add message to ticket

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run migrate` - Run database migrations
- `npm run generate` - Generate Prisma client

### Database
- Database migrations are managed with Prisma
- Schema is defined in `prisma/schema.prisma`
- Run `npm run migrate` after schema changes

### Testing
- Unit tests are located in `tests/` directory
- Tests use Jest with TypeScript support
- Mock database operations for isolated testing

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SUPABASE_PROJECT_REF` | Supabase project ref (e.g., kmlllkwz...) | Required |
| `SUPABASE_DB_PASSWORD` | Supabase database password | Required |
| `SUPABASE_URL` | Supabase URL | Required |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: 1-hour token expiry
- **Input Validation**: Zod schemas for all endpoints
- **Role-Based Access**: Middleware for role checking
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers
- **Error Handling**: Centralized error handling

## Architecture

```
src/
├── config/          # Configuration and environment
├── controllers/     # Route handlers
├── db/             # Database client
├── middleware/     # Express middleware
├── routes/         # API route definitions
├── schemas/        # Zod validation schemas
├── services/       # Business logic
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── main.ts         # Application entry point
```

## License

MIT
