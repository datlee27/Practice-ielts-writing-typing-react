import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, Keyboard, Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react';
import LoginGoogle from '../components/LoginGoogle';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login({ email, password });
      // Redirect to the page they were trying to access, or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950 via-slate-900 to-slate-800"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-teal-950/30 border border-teal-800 px-4 py-2 rounded-full mb-8">
              <Zap className="w-4 h-4 text-teal-400" />
              <span className="text-sm text-teal-400">Premium IELTS Training</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 text-teal-100 leading-tight">
              Master IELTS Writing
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Join thousands of students improving their IELTS writing skills with AI-powered feedback and personalized practice.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
              <div className="w-10 h-10 bg-teal-950/50 border border-teal-800 rounded-lg flex items-center justify-center mb-3">
                <Keyboard className="w-5 h-5 text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-teal-100 mb-2">Real-time Practice</h3>
              <p className="text-slate-400 text-sm">Practice with authentic IELTS tasks and get instant feedback</p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
              <div className="w-10 h-10 bg-teal-950/50 border border-teal-800 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-teal-100 mb-2">AI Analysis</h3>
              <p className="text-slate-400 text-sm">Get detailed scoring on all 4 IELTS criteria</p>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-600/25">
              <Keyboard className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-teal-100 mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to continue your IELTS journey</p>
          </div>

          {/* Login Form */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-red-800 bg-red-950/50">
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-400 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 shadow-lg shadow-teal-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-teal-600/30"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-800 px-3 text-slate-400 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <div className="flex justify-center">
                <LoginGoogle />
              </div>

              {/* Sign Up Link */}
              <div className="text-center mt-8">
                <span className="text-slate-400 text-sm">Don't have an account? </span>
                <Link
                  to="/register"
                  className="text-teal-400 hover:text-teal-300 font-semibold text-sm transition-colors"
                >
                  Sign up for free
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center">
            <p className="text-slate-500 text-sm">
              © 2024 IELTS Writing Practice. Built for success.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};