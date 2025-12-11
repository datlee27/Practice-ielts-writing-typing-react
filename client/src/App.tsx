import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LandingPage } from './pages/LandingPage';
import { PracticePage } from './pages/PracticePage';
import { MockTestPage } from './pages/MockTestPage';
import { CustomPromptPage } from './pages/CustomPromptPage';
import { TestReportPage } from './pages/TestReportPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
      />

      {/* Practice page - accessible to both guest and authenticated users */}
      <Route path="/practice" element={<PracticePage />} />

      {/* Landing page - accessible to all users */}
      <Route path="/" element={<LandingPage />} />

      {/* Protected routes - only for authenticated users */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mock-test"
        element={
          <ProtectedRoute>
            <MockTestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/custom-prompt"
        element={
          <ProtectedRoute>
            <CustomPromptPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <TestReportPage />
          </ProtectedRoute>
        }
      />

      {/* Redirect unknown routes to practice for guests, home for authenticated users */}
      <Route path="*" element={isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/practice" replace />} />
    </Routes>
  );
}

export default App;
