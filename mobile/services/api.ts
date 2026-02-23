import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { 
  AuthResponse, 
  RegisterData, 
  LoginData, 
  CreateWorkerProfileData, 
  UpdateWorkerProfileData,
  SearchWorkersParams,
  CreateBookingData,
  CreateReviewData,
  CreateMessageData,
  User,
  WorkerProfile,
  BookingRequest,
  Review,
  Message
} from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('authToken');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const workersAPI = {
  createProfile: async (data: CreateWorkerProfileData): Promise<{ profile: WorkerProfile }> => {
    const response = await api.post('/workers/profile', data);
    return response.data;
  },

  updateProfile: async (data: UpdateWorkerProfileData): Promise<{ profile: WorkerProfile }> => {
    const response = await api.put('/workers/profile', data);
    return response.data;
  },

  searchWorkers: async (params: SearchWorkersParams): Promise<{ workers: WorkerProfile[] }> => {
    const response = await api.get('/workers/search', { params });
    return response.data;
  },

  getWorker: async (id: string): Promise<{ worker: WorkerProfile }> => {
    const response = await api.get(`/workers/${id}`);
    return response.data;
  },

  getWorkerReviews: async (workerId: string): Promise<{ reviews: Review[] }> => {
    const response = await api.get(`/reviews/workers/${workerId}/reviews`);
    return response.data;
  },
};

export const bookingsAPI = {
  createBooking: async (data: CreateBookingData): Promise<{ booking: BookingRequest }> => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getBookings: async (status?: string): Promise<{ bookings: BookingRequest[] }> => {
    const params = status ? { status } : {};
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  updateBookingStatus: async (id: string, status: string): Promise<{ booking: BookingRequest }> => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  },

  getBookingMessages: async (bookingId: string): Promise<{ messages: Message[] }> => {
    const response = await api.get(`/bookings/${bookingId}/messages`);
    return response.data;
  },

  sendMessage: async (bookingId: string, data: CreateMessageData): Promise<{ message: Message }> => {
    const response = await api.post(`/bookings/${bookingId}/messages`, data);
    return response.data;
  },
};

export const reviewsAPI = {
  createReview: async (data: CreateReviewData): Promise<{ review: Review }> => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  getWorkerReviews: async (workerId: string): Promise<{ reviews: Review[] }> => {
    const response = await api.get(`/reviews/workers/${workerId}/reviews`);
    return response.data;
  },
};

export const setAuthToken = async (token: string) => {
  await SecureStore.setItemAsync('authToken', token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('authToken');
};

export const removeAuthToken = async () => {
  await SecureStore.deleteItemAsync('authToken');
};

export default api;
