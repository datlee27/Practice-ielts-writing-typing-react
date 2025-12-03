import { Clock, Gauge, Target } from 'lucide-react';

interface StatusBarProps {
  wpm: number;
  accuracy: number;
  time: number;
}

export function StatusBar({ wpm, accuracy, time }: StatusBarProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        <div className="grid grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-blue-300">WPM</div>
              <div className="text-2xl">{wpm}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-green-300">Accuracy</div>
              <div className="text-2xl">{accuracy}%</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-purple-300">Time</div>
              <div className="text-2xl">{formatTime(time)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
