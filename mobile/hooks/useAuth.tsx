import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, RegisterData, LoginData } from '../types';
import { authAPI, setAuthToken, removeAuthToken, getAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const refreshUser = async () => {
    try {
      const { user: userData } = await authAPI.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      await logout();
    }
  };

  const login = async (data: LoginData) => {
    try {
      const { user: userData, token } = await authAPI.login(data);
      await setAuthToken(token);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const { user: userData, token } = await authAPI.register(data);
      await setAuthToken(token);
      setUser(userData);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await removeAuthToken();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getAuthToken();
        if (token) {
          await refreshUser();
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
