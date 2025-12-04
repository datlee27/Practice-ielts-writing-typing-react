import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Home, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';

const mockPrompt = {
  task1: "The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  task2: "Some people believe that technology has made our lives more complicated, while others argue that it has made things easier. Discuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience."
};

export function MockTestPage() {
  const navigate = useNavigate();
  const [essay, setEssay] = useState('');
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    let interval: number;
    if (isStarted && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const wordCount = essay.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleSubmit = () => {
    navigate('/report', {
      state: {
        essay,
        wordCount,
        timeSpent: 60 * 60 - timeLeft,
        isMockTest: true
      }
    });
  };

  const getTimeColor = () => {
    if (timeLeft < 300) return 'text-red-400'; // Less than 5 minutes
    if (timeLeft < 600) return 'text-orange-400'; // Less than 10 minutes
    return 'text-teal-400';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <h1 className="text-2xl">IELTS Writing Mock Test</h1>

          <div className={`flex items-center gap-2 text-xl font-mono ${getTimeColor()}`}>
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {!isStarted ? (
            <div className="text-center space-y-6 py-20">
              <h2 className="text-3xl text-teal-400">IELTS Writing Task 2</h2>
              <p className="text-xl text-slate-400">Duration: 60 minutes</p>
              <p className="text-lg text-slate-400">Minimum words: 250</p>
              <Button
                onClick={handleStart}
                className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-6 text-lg mt-8"
              >
                Start Test
              </Button>
            </div>
          ) : (
            <>
              {/* Task Prompt */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <h2 className="text-xl text-teal-400">Writing Task 2</h2>
                </div>
                <p className="text-lg leading-relaxed text-slate-200">
                  {mockPrompt.task2}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-700 text-sm text-slate-400">
                  Write at least 250 words.
                </div>
              </div>

              {/* Essay Input */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg text-teal-400">Your Essay</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400">
                      Words: <span className={`font-mono ${wordCount >= 250 ? 'text-teal-400' : 'text-orange-400'}`}>{wordCount}</span>
                    </span>
                  </div>
                </div>
                <textarea
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  className="w-full h-96 bg-slate-900/50 text-white text-lg leading-relaxed p-6 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none font-sans"
                  placeholder="Start writing your essay here..."
                  autoFocus
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="border-slate-700 text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-teal-600 hover:bg-teal-500 text-white px-8"
                  disabled={wordCount < 50}
                >
                  Submit Essay
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}