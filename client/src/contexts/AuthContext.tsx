import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient, { User, LoginRequest, RegisterRequest, GoogleLoginRequest, GoogleUserInfo } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  googleLogin: (googleData: GoogleUserInfo) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
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

  useEffect(() => {
    // Check if user is already logged in on app start
    const token = apiClient.getToken();
    const googleUser = localStorage.getItem('google_user');

    if (token) {
      loadUserProfile();
    } else if (googleUser) {
      // Load Google user from localStorage
      try {
        const userData = JSON.parse(googleUser);
        setUser(userData);
        setIsLoading(false);
      } catch (error) {
        localStorage.removeItem('google_user');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await apiClient.getProfile();
      setUser(userData);
    } catch (error) {
      // Token might be invalid, clear it
      apiClient.setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      const authResponse = await apiClient.login(data);
      setUser(authResponse.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      const authResponse = await apiClient.register(data);
      setUser(authResponse.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (googleData: GoogleUserInfo) => {
    try {
      setIsLoading(true);

      // Tạo user object từ Google data
      const userData: User = {
        id: 0, // Will be assigned by backend
        uuid: '', // Will be assigned by backend
        email: googleData.email,
        firstName: googleData.name.split(' ')[0] || '',
        lastName: googleData.name.split(' ').slice(1).join(' ') || '',
        avatar: googleData.picture,
        googleId: googleData.sub,
        provider: 'google'
      };

      // Lưu vào localStorage (tạm thời, sau này sẽ gửi lên backend)
      localStorage.setItem('google_user', JSON.stringify(userData));
      setUser(userData);

    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Xóa cả localStorage thông thường và Google user data
    apiClient.logout();
    localStorage.removeItem('google_user');
    setUser(null);
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    googleLogin,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};