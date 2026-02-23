# LocalLink Mobile App

React Native (Expo) frontend for LocalLink, a hyper-local marketplace app connecting neighborhoods with verified local service providers.

## Tech Stack

- **Framework:** React Native with Expo
- **Navigation:** Expo Router (file-based routing)
- **Language:** TypeScript
- **State Management:** React Context for auth state
- **Storage:** Expo SecureStore for JWT tokens
- **HTTP Client:** Axios with interceptors
- **Location:** Expo Location for geolocation
- **UI:** Custom components with consistent design system

## Features

- **Authentication:** JWT-based login/register with role selection (Customer/Worker)
- **Worker Onboarding:** Multi-step profile creation with service categories, pricing, and location
- **Location-Based Search:** Find workers by distance with Haversine formula
- **Booking Management:** Create, accept, decline, and complete bookings
- **Real-time Messaging:** In-app chat for accepted bookings
- **Review System:** Customer reviews with star ratings
- **Verification Badges:** Visual indicators for worker verification levels
- **Role-Based UI:** Different experiences for customers and workers

## Project Structure

```
mobile/
├── app/                      # Expo Router file-based routing
│   ├── _layout.tsx           # Root layout with auth provider
│   ├── (auth)/               # Auth screens (unauthenticated)
│   │   ├── _layout.tsx       # Auth layout with redirect logic
│   │   ├── welcome.tsx       # Role selection
│   │   ├── login.tsx         # Login screen
│   │   ├── register.tsx      # Registration screen
│   │   └── onboarding.tsx    # Worker profile setup
│   ├── (tabs)/               # Main app (authenticated)
│   │   ├── _layout.tsx       # Bottom tab navigator
│   │   ├── home.tsx          # Search/Dashboard
│   │   ├── bookings.tsx      # My bookings
│   │   └── profile.tsx       # Profile/settings
│   ├── worker/[id].tsx       # Worker profile detail
│   ├── booking/[id].tsx      # Booking detail + chat
│   ├── book/[workerId].tsx   # Create booking request
│   └── review/[bookingId].tsx # Leave review form
├── components/
│   ├── WorkerCard.tsx        # Search result card
│   ├── ReviewCard.tsx         # Review display card
│   ├── BookingCard.tsx        # Booking list item
│   ├── MessageBubble.tsx      # Chat message bubble
│   ├── VerificationBadge.tsx  # Worker verification badge
│   ├── StarRating.tsx         # Star rating component
│   └── CategoryChip.tsx       # Service category filter
├── hooks/
│   ├── useAuth.tsx            # Auth context + provider
│   └── useLocation.tsx        # Location services
├── services/
│   └── api.ts                # Axios instance + API functions
├── types/
│   └── index.ts              # TypeScript interfaces
└── assets/
    └── images/
        └── default-avatar.png
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio/Android SDK (for Android development)

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your API URL:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator:**
   - **iOS:** Press `i` in the Expo terminal
   - **Android:** Press `a` in the Expo terminal
   - **Web:** Press `w` in the Expo terminal

### API Configuration

The mobile app connects to the LocalLink backend API. Make sure:

1. The backend server is running (typically on `http://localhost:3000`)
2. Update `EXPO_PUBLIC_API_URL` in your `.env` file to point to your backend
3. For physical device testing, use your computer's IP address instead of `localhost`

## Usage

### For Customers

1. **Sign up** as a customer
2. **Search** for workers by location, category, or verification status
3. **View profiles** with ratings and reviews
4. **Request bookings** with specific dates and times
5. **Communicate** with workers through in-app messaging
6. **Leave reviews** after completed services

### For Workers

1. **Sign up** as a service provider
2. **Complete onboarding** with profile details, services, and service area
3. **Receive booking requests** from customers
4. **Accept or decline** requests based on availability
5. **Communicate** with customers through messaging
6. **Mark jobs complete** and receive reviews

## Design System

### Colors
- **Primary:** `#2A9D8F` (soft teal)
- **Secondary:** `#E9C46A` (warm amber)
- **Background:** `#FAFAF8` (off-white)
- **Text:** `#264653` (dark charcoal)
- **Error:** `#E76F51` (muted red)

### Typography
- **Headings:** 24-28px, bold
- **Body:** 16px, regular
- **Secondary:** 14px, regular
- **Captions:** 12px, regular

### Components
- **Cards:** Rounded corners, subtle shadows
- **Buttons:** Consistent padding and colors
- **Forms:** Clear labels and validation
- **Badges:** Color-coded verification levels

## API Integration

The app uses a centralized API service (`services/api.ts`) with:

- **Axios instance** with base URL configuration
- **JWT interceptor** for automatic token attachment
- **Error handling** with 401 redirect to login
- **Typed functions** for all API endpoints

### Key API Functions

```typescript
// Authentication
authAPI.register(data)
authAPI.login(data)
authAPI.getMe()

// Workers
workersAPI.searchWorkers(params)
workersAPI.getWorker(id)
workersAPI.createProfile(data)

// Bookings
bookingsAPI.createBooking(data)
bookingsAPI.getBookings(status?)
bookingsAPI.updateBookingStatus(id, status)

// Reviews
reviewsAPI.createReview(data)
reviewsAPI.getWorkerReviews(workerId)

// Messages
bookingsAPI.sendMessage(bookingId, data)
bookingsAPI.getBookingMessages(bookingId)
```

## Testing

### Manual Testing Flow

1. **Customer Journey:**
   - Register as customer
   - Search for workers
   - View worker profiles
   - Send booking request
   - Receive acceptance
   - Send messages
   - Complete booking
   - Leave review

2. **Worker Journey:**
   - Register as worker
   - Complete onboarding
   - Receive booking request
   - Accept booking
   - Communicate with customer
   - Mark job complete
   - View review

### Test Data

The backend seed script creates realistic test data:
- 15 workers across Boston neighborhoods
- 5 customer accounts
- Sample bookings, reviews, and messages

## Troubleshooting

### Common Issues

1. **API Connection Errors:**
   - Ensure backend is running
   - Check `EXPO_PUBLIC_API_URL` in `.env`
   - For physical devices, use IP address instead of `localhost`

2. **Location Permission Denied:**
   - App will default to Boston coordinates
   - Enable location permissions in device settings

3. **Authentication Issues:**
   - Check JWT token in SecureStore
   - Verify API endpoint URLs
   - Check network connectivity

4. **Build Errors:**
   - Clear Expo cache: `npx expo start --clear`
   - Reset node modules: `rm -rf node_modules && npm install`

## Development Tips

- **Hot Reloading:** Expo supports fast refresh for most changes
- **Debugging:** Use Expo DevTools and React Native Debugger
- **Testing:** Test on both iOS and Android platforms
- **Performance:** Monitor bundle size and loading times
- **Accessibility:** Test with screen readers and accessibility tools

## Deployment

### Expo Build Service

```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android

# Build for web
npx expo build:web
```

### App Store Submission

1. Configure `app.json` with app metadata
2. Generate build using Expo EAS
3. Submit to respective app stores
4. Configure production API URL

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Add proper error handling and loading states
4. Test on multiple screen sizes
5. Update documentation for new features

## License

MIT
