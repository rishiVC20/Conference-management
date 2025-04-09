import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios, { CancelTokenSource } from 'axios';
import axiosInstance from '../config/axios';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'presenter' | 'attendee';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (username: string, email: string, password: string, role: 'presenter' | 'attendee') => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const defaultContext: AuthContextType = {
  user: null,
  login: async () => null,
  register: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  loading: true
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const publicRoutes = ['/', '/dashboard', '/timetable', '/login', '/register', '/forgot-password', '/reset-password'];

  const checkAuth = useCallback(async () => {
    if (isAuthChecking || isRegistering) return;

    const isPublic = publicRoutes.some(path => location.pathname.startsWith(path));
    if (isPublic) {
      setLoading(false);
      return;
    }

    setIsAuthChecking(true);

    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('Operation canceled due to new request.');
    }

    cancelTokenRef.current = axios.CancelToken.source();

    try {
      const response = await axiosInstance.get('/auth/me', {
        cancelToken: cancelTokenRef.current.token
      });

      if (response.data.success) {
        const userData = response.data.data.user;
        setUser(userData);

        if (location.pathname === '/') {
          navigate(`/${userData.role.toLowerCase()}`, { replace: true });
        }
      } else {
        setUser(null);
        if (!isPublic) {
          navigate('/login', { replace: true });
        }
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Auth check error:', error);
        setUser(null);
        if (!isPublic) {
          navigate('/login', { replace: true });
        }
      }
    } finally {
      setLoading(false);
      setIsAuthChecking(false);
    }
  }, [navigate, location.pathname, isAuthChecking, isRegistering]);

  useEffect(() => {
    checkAuth();
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted');
        cancelTokenRef.current = null;
      }
    };
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const userData = response.data.data.user;
        setUser(userData);
        navigate(`/${userData.role.toLowerCase()}`, { replace: true });
        return userData;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    role: 'presenter' | 'attendee'
  ) => {
    setIsRegistering(true);
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/register', {
        username,
        email,
        password,
        role
      });

      if (response.data.success) {
        const userData = response.data.data.user;
        setUser(userData);
        navigate(`/${userData.role.toLowerCase()}`, { replace: true });
        return;
      }
      throw new Error(response.data.message || 'Registration failed');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (axios.isCancel(error)) return;
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
      setIsRegistering(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setLoading(false);
      navigate('/login', { replace: true });
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
