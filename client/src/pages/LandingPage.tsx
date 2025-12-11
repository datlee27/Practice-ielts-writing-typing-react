import React from 'react';
import { useNavigate } from 'react-router';
import { Keyboard, FileText, TrendingUp, Zap, LogOut, User, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

export function LandingPage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/practice');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="px-8 py-6 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-3xl text-teal-400">typingtest</div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 text-slate-300">
                  <User className="w-4 h-4" />
                  <span>Welcome, {user?.firstName || user?.email}!</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-red-400 hover:bg-red-950/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-teal-400"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="px-8 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal-950/30 border border-teal-800 px-4 py-2 rounded-full mb-8">
            <Zap className="w-4 h-4 text-teal-400" />
            <span className="text-sm text-teal-400">Minimalist & Effective</span>
          </div>

          <h1 className="text-6xl mb-6 text-teal-100">
            Master IELTS Writing
          </h1>
          <p className="text-2xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Improve your typing speed and IELTS writing skills with focused practice and AI-powered feedback
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => navigate('/practice')}
              className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-6 text-lg rounded-lg"
            >
              Start Typing Practice
            </Button>
            {isAuthenticated ? (
              <Button
                onClick={() => navigate('/mock-test')}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg rounded-lg"
              >
                Take Mock Test
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg rounded-lg"
              >
                <Lock className="w-4 h-4 mr-2" />
                Login for Mock Test
              </Button>
            )}
          </div>

          {!isAuthenticated && (
            <div className="mt-8 p-4 bg-slate-800/30 border border-slate-700 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-slate-400 mb-3">Login to unlock additional features:</p>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Upload your own essays for practice</li>
                <li>• Take full IELTS mock tests</li>
                <li>• Track your progress over time</li>
                <li>• Get detailed performance analytics</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-8 py-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8 hover:border-teal-700 transition-all">
            <div className="w-12 h-12 bg-teal-950/50 border border-teal-800 rounded-lg flex items-center justify-center mb-4">
              <Keyboard className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-xl mb-3 text-teal-100">Focused Typing Practice</h3>
            <p className="text-slate-400 leading-relaxed">
              Clean, distraction-free interface with real-time WPM, KPM, accuracy tracking, and virtual keyboard visualization
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8 hover:border-teal-700 transition-all">
            <div className="w-12 h-12 bg-teal-950/50 border border-teal-800 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-xl mb-3 text-teal-100">IELTS Mock Tests</h3>
            <p className="text-slate-400 leading-relaxed">
              Practice with authentic IELTS Writing tasks in a timed environment that simulates the real exam
            </p>
            {!isAuthenticated && (
              <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Login required
              </div>
            )}
          </div>

          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8 hover:border-teal-700 transition-all">
            <div className="w-12 h-12 bg-teal-950/50 border border-teal-800 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-xl mb-3 text-teal-100">AI-Powered Analysis</h3>
            <p className="text-slate-400 leading-relaxed">
              Get detailed feedback on all four IELTS criteria with actionable suggestions for improvement
            </p>
            {!isAuthenticated && (
              <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Login required
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-8 py-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl text-teal-400 mb-2">10+</div>
              <div className="text-slate-400">Practice Texts</div>
            </div>
            <div>
              <div className="text-4xl text-teal-400 mb-2">Real-time</div>
              <div className="text-slate-400">WPM & KPM Tracking</div>
            </div>
            <div>
              <div className="text-4xl text-teal-400 mb-2">4</div>
              <div className="text-slate-400">IELTS Criteria</div>
            </div>
            <div>
              <div className="text-4xl text-teal-400 mb-2">Detailed</div>
              <div className="text-slate-400">Error Analysis</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center text-slate-500">
          <p>Built for IELTS learners who value simplicity and effectiveness</p>
        </div>
      </footer>
    </div>
  );
}