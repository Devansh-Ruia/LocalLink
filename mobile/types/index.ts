export type UserRole = 'WORKER' | 'CUSTOMER';
export type ServiceCategory = 'BABYSITTING' | 'TUTORING' | 'HANDYMAN' | 'CLEANING' | 'LANDSCAPING' | 'PET_CARE' | 'OTHER';
export type VerificationBadge = 'NONE' | 'ID_VERIFIED' | 'SKILL_CHECKED' | 'FULLY_CERTIFIED';
export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  profileImageUrl?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  workerProfile?: WorkerProfile;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  bio: string;
  serviceCategory: ServiceCategory;
  hourlyRate?: number;
  locationLat: number;
  locationLng: number;
  neighborhood: string;
  radiusMiles: number;
  isVerified: boolean;
  verificationBadge: VerificationBadge;
  availabilityNotes?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
  };
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
  distance?: number;
}

export interface BookingRequest {
  id: string;
  customerId: string;
  workerId: string;
  serviceCategory: ServiceCategory;
  message: string;
  proposedDate: string;
  proposedTime: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
  };
  worker: {
    id: string;
    bio: string;
    serviceCategory: ServiceCategory;
    hourlyRate?: number;
    locationLat: number;
    locationLng: number;
    neighborhood: string;
    radiusMiles: number;
    isVerified: boolean;
    verificationBadge: VerificationBadge;
    availabilityNotes?: string;
    user: {
      id: string;
      name: string;
      email: string;
      profileImageUrl?: string;
    };
  };
  reviews?: Review[];
}

export interface Review {
  id: string;
  reviewerId: string;
  workerId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
  };
  booking?: {
    id: string;
    serviceCategory: ServiceCategory;
    createdAt: string;
  };
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  text: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    profileImageUrl?: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateWorkerProfileData {
  bio: string;
  serviceCategory: ServiceCategory;
  hourlyRate?: number;
  locationLat: number;
  locationLng: number;
  neighborhood: string;
  radiusMiles?: number;
  availabilityNotes?: string;
}

export interface UpdateWorkerProfileData extends Partial<CreateWorkerProfileData> {}

export interface SearchWorkersParams {
  lat: number;
  lng: number;
  radius?: number;
  category?: ServiceCategory;
  minRating?: number;
  verifiedOnly?: boolean;
}

export interface CreateBookingData {
  workerId: string;
  serviceCategory: ServiceCategory;
  message: string;
  proposedDate: string;
  proposedTime: string;
}

export interface CreateReviewData {
  bookingId: string;
  rating: number;
  comment: string;
}

export interface CreateMessageData {
  text: string;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}
