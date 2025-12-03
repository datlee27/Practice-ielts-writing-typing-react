import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Home, FileText } from 'lucide-react';
import { Button } from './ui/button';

export function CustomPromptInput() {
  const location = useLocation();
  const navigate = useNavigate();
  const { typedText, wpm, accuracy, time, uploadedImage } = location.state || {};
  
  const [prompt, setPrompt] = useState('');
  const [taskType, setTaskType] = useState<'task1' | 'task2'>('task2');

  const handleSubmit = () => {
    if (prompt.trim()) {
      navigate('/report', {
        state: {
          essay: typedText,
          prompt,
          taskType,
          wpm,
          accuracy,
          time,
          wordCount: typedText?.trim().split(/\s+/).length || 0,
          isMockTest: true,
          isCustomPractice: true,
          uploadedImage
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          
          <h1 className="text-2xl">Nhập Đề Bài</h1>
          
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Stats Summary */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-teal-400" />
              <h2 className="text-lg text-teal-400">Kết Quả Luyện Gõ</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl text-teal-400">{wpm}</div>
                <div className="text-sm text-slate-400">WPM</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-teal-400">{accuracy}%</div>
                <div className="text-sm text-slate-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-teal-400">{Math.floor(time / 1000)}s</div>
                <div className="text-sm text-slate-400">Time</div>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {uploadedImage && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg text-teal-400 mb-4">Bài Làm Của Bạn</h3>
              <img
                src={uploadedImage}
                alt="Your essay"
                className="max-h-64 mx-auto rounded border border-slate-700"
              />
            </div>
          )}

          {/* Task Type Selection */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg text-teal-400 mb-4">Loại Task</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setTaskType('task1')}
                className={`flex-1 py-3 rounded-lg transition-colors ${
                  taskType === 'task1'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                Task 1
              </button>
              <button
                onClick={() => setTaskType('task2')}
                className={`flex-1 py-3 rounded-lg transition-colors ${
                  taskType === 'task2'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                Task 2
              </button>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg text-teal-400 mb-4">Nhập Đề Bài</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                taskType === 'task1'
                  ? 'Ví dụ: The chart below shows the percentage of households in owned and rented accommodation...'
                  : 'Ví dụ: Some people believe that technology has made our lives more complicated...'
              }
              className="w-full h-48 bg-slate-900/50 text-white p-4 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
            <p className="text-sm text-slate-400 mt-2">
              Nhập đề bài chính xác để AI có thể chấm điểm bài viết của bạn theo đúng tiêu chí IELTS
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-teal-950/30 border border-teal-800 rounded-lg p-6">
            <p className="text-sm text-teal-300 mb-2">📝 Lưu ý:</p>
            <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
              <li>Đề bài giúp AI hiểu yêu cầu và chấm điểm Task Response chính xác</li>
              <li>Hãy nhập đề bài đầy đủ như trong đề thi thật</li>
              <li>AI sẽ phân tích bài viết theo 4 tiêu chí IELTS Writing</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate('/practice')}
              variant="outline"
              className="border-slate-700 text-slate-400 hover:bg-slate-800"
            >
              Quay Lại
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              className="bg-teal-600 hover:bg-teal-500 text-white px-8"
            >
              Xem Kết Quả AI Chấm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
