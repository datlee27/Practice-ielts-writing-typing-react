import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleUserInfo } from '../services/api';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOut, User } from 'lucide-react';

// Thay YOUR_CLIENT_ID bằng Client ID từ Google Cloud Console
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Kiểm tra nếu chưa cấu hình Client ID
if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'your_google_client_id_here') {
  console.warn('⚠️ Google Client ID chưa được cấu hình! Vui lòng cập nhật VITE_GOOGLE_CLIENT_ID trong file .env');
}
declare global {
  interface Window {
    google: any;
  }
}

const LoginGoogle: React.FC = () => {
  const { user, isAuthenticated, googleLogin, logout, isLoading } = useAuth();
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Load Google Identity Services script
  useEffect(() => {
    if (window.google) {
      setIsGoogleLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Khởi tạo Google Sign-In khi script đã load
  useEffect(() => {
    if (!isGoogleLoaded || !window.google || !buttonRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      });
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
    }
  }, [isGoogleLoaded]);

  // Xử lý khi Google login thành công
  const handleGoogleLogin = async (response: any) => {
    try {
      // Decode JWT token để lấy thông tin user
      const decodedToken = JSON.parse(atob(response.credential.split('.')[1]));

      const googleUserData: GoogleUserInfo = {
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture,
        sub: decodedToken.sub, // Google ID
      };

      await googleLogin(googleUserData);
    } catch (error) {
      console.error('Error processing Google login:', error);
      alert('Đăng nhập Google thất bại. Vui lòng thử lại.');
    }
  };

  // Xử lý logout
  const handleLogout = () => {
    logout();

    // Optional: Revoke Google token
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.revoke();
    }
  };

  // Hiển thị loading state
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <span className="text-gray-500">Đang tải...</span>
      </div>
    );
  }

  // Nếu đã đăng nhập, hiển thị thông tin user và nút logout
  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user.avatar} alt={user.firstName || user.email} />
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.email
            }
          </span>
          <span className="text-xs text-gray-500">via Google</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center space-x-1"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    );
  }

  // Nếu chưa đăng nhập, hiển thị nút Google Sign-In
  return (
    <div className="flex flex-col items-center space-y-2">
      <div ref={buttonRef}></div>

      {/* Fallback button nếu Google script chưa load */}
      {!isGoogleLoaded && (
        <Button
          variant="outline"
          onClick={() => alert('Google Sign-In đang tải. Vui lòng đợi...')}
          className="flex items-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Login with Google</span>
        </Button>
      )}
    </div>
  );
};

export default LoginGoogle;
