import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { RotateCcw, Upload, BookOpen, Image, Lock, RefreshCw } from 'lucide-react';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { Button } from '../components/ui/button';
import { FileUploadModal } from '../components/FileUploadModal';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';
type PracticeMode = 'preset' | 'custom';

export function PracticePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState<PracticeMode>('preset');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [zenMode, setZenMode] = useState(false);
  const [lastPressedKey, setLastPressedKey] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [customText, setCustomText] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [errors, setErrors] = useState<{ position: number; expected: string; actual: string }[]>([]);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<any>(null);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [customPrompt, setCustomPrompt] = useState<{
    title: string;
    content: string;
    taskType: 'task1' | 'task2';
    category: string;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);


  const sampleText = mode === 'preset'
    ? (currentPrompt?.sampleEssay || "No sample essay available for this prompt. Please select another prompt or upload your own text.")
    : customText;
  const words = sampleText.split(' ').filter(w => w.length > 0);

  useEffect(() => {
    let interval: number;
    if (startTime) {
      interval = window.setInterval(() => {
        setCurrentTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    containerRef.current?.focus();
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      setLoadingPrompts(true);
      const response = await apiClient.getRandomPrompts(10);
      setPrompts(response);
      if (response.length > 0) {
        setCurrentPrompt(response[0]);
      }
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
    } finally {
      setLoadingPrompts(false);
    }
  };

  const getRandomPrompt = () => {
    if (prompts.length === 0) return;
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPrompt(prompts[randomIndex]);
    setShowFullText(false);
    resetPractice();
  };

  useEffect(() => {
    if (lastPressedKey) {
      const timer = setTimeout(() => setLastPressedKey(''), 200);
      return () => clearTimeout(timer);
    }
  }, [lastPressedKey]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ') {
      e.preventDefault();

      setLastPressedKey(e.key === ' ' ? 'Space' : e.key);

      if (e.key === 'Backspace') {
        setUserInput(prev => prev.slice(0, -1));
        // Remove the last error if it was just made
        setErrors(prev => prev.slice(0, -1));
      } else {
        const newInput = userInput + e.key;
        setUserInput(newInput);
        setTotalKeystrokes(prev => prev + 1);

        if (!startTime && newInput.length === 1) {
          setStartTime(Date.now());
        }

        // Track errors: check if current character matches expected
        const currentPosition = newInput.length - 1;
        const expectedChar = sampleText[currentPosition];
        if (expectedChar && e.key !== expectedChar) {
          setErrors(prev => [...prev, {
            position: currentPosition,
            expected: expectedChar,
            actual: e.key
          }]);
        }

        // Check if completed all words
        const typedWords = newInput.trim().split(' ').filter(w => w.length > 0);
        if (typedWords.length >= words.length && newInput.endsWith(' ')) {
          setTimeout(async () => {
            const finalStats = calculateFinalStats(newInput);

            // Save results for authenticated users
            await savePracticeResults(finalStats, newInput);

            if (mode === 'custom') {
              // For custom mode, go to prompt input
              navigate('/custom-prompt', {
                state: {
                  typedText: newInput,
                  ...finalStats,
                  uploadedImage
                }
              });
            } else {
              // For preset mode, go directly to report
              navigate('/report', {
                state: {
                  ...finalStats,
                  completeness: 100
                }
              });
            }
          }, 500);
        }
      }
    }
  };

  const calculateWPM = () => {
    if (!startTime || currentTime === 0) return 0;
    const minutes = currentTime / 60000;
    const typedWords = userInput.trim().split(' ').filter(w => w.length > 0).length;
    return Math.round(typedWords / minutes);
  };

  const calculateKPM = () => {
    if (!startTime || currentTime === 0) return 0;
    const minutes = currentTime / 60000;
    return Math.round(totalKeystrokes / minutes);
  };

  const calculateAccuracy = () => {
    const typedWords = userInput.trim().split(' ').filter(w => w.length > 0);
    if (typedWords.length === 0) return 100;

    let correctWords = 0;
    for (let i = 0; i < typedWords.length && i < words.length; i++) {
      if (typedWords[i] === words[i]) {
        correctWords++;
      }
    }
    return Math.round((correctWords / typedWords.length) * 100);
  };

  const calculateFinalStats = (finalInput: string) => {
    const finalTime = currentTime;
    const finalTypedWords = finalInput.trim().split(' ').filter(w => w.length > 0);
    const minutes = finalTime / 60000;

    const wpm = Math.round(finalTypedWords.length / minutes);
    const kpm = Math.round(totalKeystrokes / minutes);

    // Calculate character-level accuracy
    let correctChars = 0;
    for (let i = 0; i < finalInput.length && i < sampleText.length; i++) {
      if (finalInput[i] === sampleText[i]) {
        correctChars++;
      }
    }
    const charAccuracy = sampleText.length > 0 ? Math.round((correctChars / sampleText.length) * 100) : 100;

    // Calculate word-level accuracy
    let correctWords = 0;
    for (let i = 0; i < finalTypedWords.length && i < words.length; i++) {
      if (finalTypedWords[i] === words[i]) {
        correctWords++;
      }
    }
    const wordAccuracy = finalTypedWords.length > 0 ? Math.round((correctWords / finalTypedWords.length) * 100) : 100;

    return {
      wpm,
      kpm,
      accuracy: charAccuracy,
      wordAccuracy,
      time: finalTime,
      totalKeystrokes,
      errorCount: errors.length,
      errors,
      totalChars: sampleText.length,
      typedChars: finalInput.length
    };
  };

  const savePracticeResults = async (stats: any, finalInput: string) => {
    if (!isAuthenticated) return;

    try {
      await apiClient.submitTest({
        testType: 'practice',
        mode: mode,
        sampleText: sampleText,
        userInput: finalInput,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        timeSpent: stats.time,
        wordCount: stats.typedChars,
        completedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to save practice results:', error);
      // Continue to navigate even if saving fails
    }
  };

  const getCurrentWordIndex = () => {
    const typedWords = userInput.trim().split(' ').filter(w => w.length > 0);
    return userInput.endsWith(' ') ? typedWords.length : typedWords.length - 1;
  };

  const renderWords = () => {
    const typedWords = userInput.trim().split(' ').filter(w => w.length > 0);
    const currentWordIndex = getCurrentWordIndex();

    // Limit words to show only first ~3 lines (approximately 60 words) when not showing full text
    const maxWordsToShow = showFullText ? words.length : Math.min(60, words.length);
    const wordsToShow = words.slice(0, maxWordsToShow);

    return wordsToShow.map((word, index) => {
      const isCurrentWord = index === currentWordIndex;
      const isTyped = index < typedWords.length;
      const isCorrect = isTyped && typedWords[index] === word;
      const isWrong = isTyped && typedWords[index] !== word;

      let wordClass = 'inline-block mr-3 transition-all duration-150 px-1 -mx-1 rounded ';

      if (isCurrentWord) {
        wordClass += 'border-b-2 border-teal-400 ';
      }

      if (isWrong) {
        wordClass += 'bg-red-500/10 ';
      }

      const chars = word.split('').map((char, charIndex) => {
        let charClass = 'transition-all duration-100 ';

        if (isTyped) {
          if (isCorrect) {
            charClass += 'text-teal-100';
          } else {
            // Word is wrong, show in red
            if (typedWords[index] && charIndex < typedWords[index].length) {
              if (typedWords[index][charIndex] === char) {
                charClass += 'text-teal-100';
              } else {
                charClass += 'text-red-400';
              }
            } else {
              charClass += 'text-slate-600';
            }
          }
        } else {
          charClass += 'text-slate-600';
        }

        return (
          <span key={charIndex} className={charClass}>
            {char}
          </span>
        );
      });

      return (
        <span key={index} className={wordClass}>
          {chars}
        </span>
      );
    });
  };

  const resetPractice = () => {
    setUserInput('');
    setStartTime(null);
    setCurrentTime(0);
    setErrors([]);
    setTotalKeystrokes(0);
    setShowFullText(false);
    containerRef.current?.focus();
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (data: {
    sampleEssay: string;
    title: string;
    content: string;
    taskType: 'task1' | 'task2';
    category: string;
    fileUrl?: string;
  }) => {
    setCustomText(data.sampleEssay);
    setUploadedImage(data.fileUrl || '');
    setCustomPrompt({
      title: data.title,
      content: data.content,
      taskType: data.taskType,
      category: data.category,
    });
    setMode('custom');
    setShowUploadModal(false);
    setShowFullText(false);
    resetPractice();
  };

  const switchToPresetMode = () => {
    setMode('preset');
    setCustomText('');
    setUploadedImage('');
    setCustomPrompt(null);
    setShowFullText(false);
    resetPractice();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      {!zenMode && (
        <header className="px-8 py-6">
          <div className="max-w-5xl mx-auto">
            {/* User Mode Indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-teal-400' : 'bg-orange-400'}`}></div>
                <span className="text-sm text-slate-400">
                  {isAuthenticated ? 'Authenticated Mode' : 'Guest Mode'}
                </span>
              </div>
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded transition-colors"
                >
                  Login for more features
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate('/')}
                className="text-2xl text-teal-400 hover:text-teal-300 transition-colors"
              >
                typingtest
              </button>
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/mock-test')}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors"
                >
                  Mock Test
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Login for Mock Test
                </button>
              )}
            </div>

            {/* Mode Selection */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={switchToPresetMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  mode === 'preset'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Đề Có Sẵn</span>
              </button>
              {isAuthenticated ? (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    mode === 'custom'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <Image className="w-4 h-4" />
                  <span>Upload Bài Làm</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-400"
                  title="Login required for custom upload"
                >
                  <Lock className="w-4 h-4" />
                  <span>Upload Bài Làm</span>
                </button>
              )}
            </div>

            {/* Settings Bar - Only show for preset mode */}
            {mode === 'preset' && (
              <div className="flex flex-wrap items-center gap-3 text-sm">

                <button
                  onClick={getRandomPrompt}
                  disabled={loadingPrompts}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 text-slate-400 hover:text-teal-400 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingPrompts ? 'animate-spin' : ''}`} />
                  <span>Random</span>
                </button>

              </div>
            )}

            {/* Preset mode info */}
            {mode === 'preset' && currentPrompt && (
              <div className="bg-teal-950/30 border border-teal-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-teal-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-teal-300 mb-1 font-medium">{currentPrompt.title}</p>
                    <p className="text-xs text-slate-400 mb-2">{currentPrompt.content}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className={`px-2 py-0.5 rounded ${
                        currentPrompt.difficulty === 'easy' ? 'bg-green-900/50 text-green-300' :
                        currentPrompt.difficulty === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
                        'bg-red-900/50 text-red-300'
                      }`}>
                        {currentPrompt.difficulty}
                      </span>
                      <span>{currentPrompt.wordCount} words</span>
                      <span>{currentPrompt.timeLimit} min</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Custom mode info */}
            {mode === 'custom' && customText && customPrompt && (
              <div className="bg-teal-950/30 border border-teal-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Image className="w-5 h-5 text-teal-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-teal-300 mb-1 font-medium">{customPrompt.title}</p>
                    <p className="text-xs text-slate-400 mb-2">{customPrompt.content}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          customPrompt.taskType === 'task1'
                            ? 'bg-blue-900/50 text-blue-300'
                            : 'bg-purple-900/50 text-purple-300'
                        }`}
                      >
                        {customPrompt.taskType === 'task1' ? 'Task 1' : 'Task 2'}
                      </span>
                      <span>{customPrompt.category}</span>
                    </div>
                  </div>
                  {uploadedImage && (
                    <img src={uploadedImage} alt="Uploaded essay" className="w-20 h-20 object-cover rounded border border-slate-700" />
                  )}
                </div>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-5xl w-full">
          {sampleText ? (
            <>
              {/* Typing Area */}
              <div
                ref={containerRef}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                className="outline-none cursor-text select-none mb-12"
              >
                <div className="font-mono text-3xl leading-relaxed" style={{ lineHeight: '3.5rem' }}>
                  {renderWords()}
                  <span className="inline-block w-0.5 h-9 bg-teal-400 ml-1 animate-pulse align-middle" />
                </div>

                {/* Show Full Text Button */}
                {!showFullText && words.length > 60 && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowFullText(true)}
                      className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors text-sm"
                    >
                      Xem Toàn Bộ Bài Viết
                    </button>
                  </div>
                )}
              </div>

              {/* Virtual Keyboard */}
              <VirtualKeyboard pressedKey={lastPressedKey} />
            </>
          ) : (
            <div className="text-center py-20">
              <Upload className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="text-xl text-slate-400 mb-6">Chọn chế độ luyện tập để bắt đầu</p>
              {isAuthenticated ? (
                <Button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3"
                >
                  <Image className="w-4 h-4 mr-2" />
                  Upload Bài Làm
                </Button>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500">Đăng nhập để sử dụng tính năng upload</p>
                  <Button
                    onClick={() => navigate('/login')}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Đăng nhập
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {!zenMode && sampleText && (
        <footer className="px-8 py-6 border-t border-slate-800">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button
              onClick={resetPractice}
              className="flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </button>

            <div className="flex items-center gap-8 text-lg">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">WPM:</span>
                <span className="text-teal-400 font-mono">{calculateWPM()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">KPM:</span>
                <span className="text-teal-400 font-mono">{calculateKPM()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">ACC:</span>
                <span className="text-teal-400 font-mono">{calculateAccuracy()}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">TIME:</span>
                <span className="text-teal-400 font-mono">{formatTime(currentTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">WORDS:</span>
                <span className="text-teal-400 font-mono">
                  {userInput.trim().split(' ').filter(w => w.length > 0).length}/{words.length}
                </span>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <FileUploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleFileUpload}
        />
      )}
    </div>
  );
}