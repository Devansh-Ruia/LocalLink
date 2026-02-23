# LocalLink

LocalLink is a hyper-local marketplace app that connects neighborhoods with trusted, verified local service providers. Whether you need childcare, home repairs, tutoring, or pet care, LocalLink helps you find reliable help right in your community.

## Tech Stack

- **Frontend:** React Native (Expo) with TypeScript
- **Backend:** Node.js + Express with TypeScript  
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with bcrypt password hashing

## Prerequisites

- Node.js 18+ 
- PostgreSQL installed and running
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Mac) or Android emulator, or Expo Go app on a physical device

## Setup Instructions

### 1. Clone the repo
```bash
git clone <repo-url>
cd locallink
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### 3. Frontend setup
```bash
cd mobile
npm install
cp .env.example .env
# Edit .env if your API is not on localhost:3001
npx expo start
```

## Demo Accounts

All demo accounts use the password: **password123**

### Customers
- **Sarah Mitchell** - sarah@test.com (Back Bay location)
- **James Rodriguez** - james@test.com (Fenway location)  
- **Priya Patel** - priya@test.com (Allston location)

### Workers
- **Maria Santos** - maria@test.com (CLEANING, Roxbury, $30/hr, Fully Certified)
- **David Chen** - david@test.com (TUTORING, Brookline, $45/hr, ID Verified)
- **Angela Washington** - angela@test.com (BABYSITTING, Dorchester, $22/hr, Fully Certified)
- **Mike O'Brien** - mike@test.com (HANDYMAN, South Boston, $40/hr, Skill Checked)
- **Fatima Al-Hassan** - fatima@test.com (TUTORING, Cambridge, $50/hr, Fully Certified)
- **Carlos Rivera** - carlos@test.com (LANDSCAPING, Jamaica Plain, $35/hr, ID Verified)
- **Jenny Park** - jenny@test.com (PET_CARE, Beacon Hill, $25/hr, None)
- **Robert Williams** - robert@test.com (HANDYMAN, Mattapan, $35/hr, Fully Certified)
- **Lisa Nguyen** - lisa@test.com (CLEANING, Chinatown, $28/hr, Skill Checked)
- **Tom Jackson** - tom@test.com (LANDSCAPING, Roslindale, $30/hr, None)
- **Aisha Brown** - aisha@test.com (BABYSITTING, Mission Hill, $20/hr, ID Verified)
- **Greg Murphy** - greg@test.com (OTHER, Charlestown, quote-based, Skill Checked)

## Project Structure

```
locallink/
├── server/                 # Node.js Express backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Auth and validation middleware
│   │   ├── utils/         # JWT and password utilities
│   │   └── index.ts       # Express app entry point
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Demo data script
│   └── package.json
├── mobile/                 # React Native Expo frontend
│   ├── app/               # Expo Router file-based routing
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API integration
│   ├── types/             # TypeScript interfaces
│   └── package.json
└── README.md
```

## Features

### For Customers
- **Location-Based Search**: Find workers by distance with Haversine calculation
- **Service Categories**: Filter by cleaning, tutoring, handyman, babysitting, landscaping, pet care
- **Worker Profiles**: View detailed profiles with bios, ratings, and verification badges
- **Booking Management**: Create, track, and manage service requests
- **In-App Messaging**: Communicate directly with service providers
- **Review System**: Rate and review completed services

### For Workers
- **Profile Creation**: Multi-step onboarding with service details and pricing
- **Service Area**: Define geographic coverage with radius-based search
- **Booking Management**: Accept, decline, and complete service requests
- **Customer Communication**: Built-in messaging for accepted bookings
- **Performance Tracking**: View ratings, reviews, and completion statistics
- **Verification System**: Display trust badges (ID Verified, Skill Checked, Fully Certified)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Workers
- `GET /api/workers/search` - Search workers by location and filters
- `GET /api/workers/:id` - Get worker profile with reviews
- `POST /api/workers/profile` - Create worker profile
- `PUT /api/workers/profile` - Update worker profile

### Bookings
- `POST /api/bookings` - Create booking request
- `GET /api/bookings` - Get user bookings
- `PUT /api/bookings/:id/status` - Update booking status
- `GET /api/bookings/:id/messages` - Get booking messages
- `POST /api/bookings/:id/messages` - Send message

### Reviews
- `POST /api/reviews` - Create review for completed booking
- `GET /api/reviews/worker/:workerId` - Get all worker reviews

## Development

### Running Locally
1. Start PostgreSQL database
2. Set up backend environment and run migrations
3. Seed database with demo data
4. Start backend server (`npm run dev`)
5. Set up frontend environment
6. Start Expo development server (`npx expo start`)

### Testing
- Backend: `npm test` (unit tests for API endpoints)
- Frontend: Manual testing recommended with Expo Go
- Demo accounts available for testing full user flows

### Database
- Schema managed with Prisma migrations
- Seed script creates realistic Boston-area demo data
- All passwords hashed with bcrypt
- JWT tokens expire after 7 days

## Security Features

- JWT-based authentication with secure token storage
- Password hashing with bcrypt
- Input validation with Zod schemas
- Role-based access control (Customer/Worker)
- API rate limiting and security headers
- SQL injection prevention with Prisma ORM

## Deployment

### Backend
- Environment variables for production
- PostgreSQL database required
- Node.js server (PM2 recommended for production)
- SSL/TLS for API endpoints

### Frontend
- Expo build service for app store deployment
- Environment-specific API URLs
- Secure storage for JWT tokens
- Platform-specific optimizations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper TypeScript typing
4. Test thoroughly with demo accounts
5. Submit a pull request with clear description

## License

MIT License - see LICENSE file for details
