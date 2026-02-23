# LocalLink Backend

Backend for LocalLink, a hyper-local marketplace app that connects neighborhoods with verified local service providers.

## Tech Stack

- **Runtime:** Node.js + Express with TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT-based (email + password), bcrypt for hashing, 7-day token expiry
- **Validation:** Zod schemas
- **Security:** Helmet, CORS, rate limiting

## Features

- User authentication (workers and customers)
- Worker profiles with location-based search
- Booking management with status tracking
- Review system with ratings
- In-app messaging for bookings
- Distance-based worker search using Haversine formula

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd locallink/server
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/locallink_db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=3000
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed the database with sample data
   npm run db:seed
   ```

### Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Workers

- `POST /api/workers/profile` - Create worker profile (WORKER only)
- `PUT /api/workers/profile` - Update worker profile (WORKER only)
- `GET /api/workers/search` - Search workers by location and filters
- `GET /api/workers/:id` - Get worker profile with reviews

### Bookings

- `POST /api/bookings` - Create booking request (CUSTOMER only)
- `GET /api/bookings` - Get user's bookings
- `PUT /api/bookings/:id/status` - Update booking status

### Reviews

- `POST /api/reviews` - Create review (CUSTOMER only)
- `GET /api/workers/:workerId/reviews` - Get worker's reviews

### Messages

- `POST /api/bookings/:bookingId/messages` - Send message
- `GET /api/bookings/:bookingId/messages` - Get booking messages

## Database Schema

The application uses the following main models:

- **User** - Basic user information and authentication
- **WorkerProfile** - Extended profile for service providers
- **BookingRequest** - Booking requests between customers and workers
- **Review** - Customer reviews for completed bookings
- **Message** - In-app messaging for bookings

## Development

### Database Management

```bash
# View database in Prisma Studio
npm run db:studio

# Reset database
npm run db:push --force-reset

# Generate new migration
npm run db:migrate -- --name migration_name
```

### Project Structure

```
server/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeding script
├── src/
│   ├── index.ts         # Express app entry point
│   ├── routes/          # API route handlers
│   ├── middleware/      # Express middleware
│   ├── utils/           # Utility functions
│   └── services/        # Business logic (if needed)
├── .env.example         # Environment variables template
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Testing

The seed script creates realistic test data including:

- 15 workers across different service categories
- 5 customer accounts
- Sample bookings, reviews, and messages
- Boston-area neighborhoods and locations

All test accounts use the password: `password123`

## Security Features

- JWT authentication with 7-day expiry
- Password hashing with bcrypt
- Rate limiting on all endpoints
- Input validation with Zod schemas
- CORS and Helmet security headers
- Role-based access control

## Deployment Notes

1. Set `NODE_ENV=production` in production
2. Use a strong, unique `JWT_SECRET`
3. Configure proper database connection pooling
4. Set up proper logging and monitoring
5. Use HTTPS in production

## License

MIT
