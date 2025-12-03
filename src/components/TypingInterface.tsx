import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { RotateCcw, Upload, BookOpen, Image } from 'lucide-react';
import { VirtualKeyboard } from './VirtualKeyboard';
import { Button } from './ui/button';
import { ImageUploadModal } from './ImageUploadModal';

const sampleTexts = {
  10: "Some people believe that technology has made our lives more complicated while others argue",
  25: "Some people believe that technology has made our lives more complicated while others argue that it has made things easier. In my opinion although technology can be challenging",
  50: "Some people believe that technology has made our lives more complicated while others argue that it has made things easier. In my opinion although technology can be challenging to adapt to initially it ultimately simplifies many aspects of daily life. Firstly modern technology has revolutionized communication. In the past staying in touch with people",
  100: "Some people believe that technology has made our lives more complicated while others argue that it has made things easier. In my opinion although technology can be challenging to adapt to initially it ultimately simplifies many aspects of daily life. Firstly modern technology has revolutionized communication. In the past staying in touch with people in different countries required expensive phone calls or lengthy written correspondence. Today video calls and instant messaging allow us to connect with anyone anywhere at virtually no cost. This has strengthened relationships"
};

type PracticeMode = 'preset' | 'custom';

export function TypingInterface() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<PracticeMode>('preset');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [wordCount, setWordCount] = useState<10 | 25 | 50 | 100>(25);
  const [includePunctuation, setIncludePunctuation] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [lastPressedKey, setLastPressedKey] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [customText, setCustomText] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  const sampleText = mode === 'preset' ? sampleTexts[wordCount] : customText;
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
  }, []);

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
      } else {
        const newInput = userInput + e.key;
        setUserInput(newInput);
        
        if (!startTime && newInput.length === 1) {
          setStartTime(Date.now());
        }

        // Check if completed all words
        const typedWords = newInput.trim().split(' ').filter(w => w.length > 0);
        if (typedWords.length >= words.length && newInput.endsWith(' ')) {
          setTimeout(() => {
            if (mode === 'custom') {
              // For custom mode, go to prompt input
              navigate('/custom-prompt', {
                state: {
                  typedText: newInput,
                  wpm: calculateWPM(),
                  accuracy: calculateAccuracy(),
                  time: currentTime,
                  uploadedImage
                }
              });
            } else {
              // For preset mode, go directly to report
              navigate('/report', {
                state: {
                  wpm: calculateWPM(),
                  accuracy: calculateAccuracy(),
                  time: currentTime,
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

  const getCurrentWordIndex = () => {
    const typedWords = userInput.trim().split(' ').filter(w => w.length > 0);
    return userInput.endsWith(' ') ? typedWords.length : typedWords.length - 1;
  };

  const renderWords = () => {
    const typedWords = userInput.trim().split(' ').filter(w => w.length > 0);
    const currentWordIndex = getCurrentWordIndex();
    
    return words.map((word, index) => {
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
    containerRef.current?.focus();
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleImageUpload = (text: string, imageUrl: string) => {
    setCustomText(text);
    setUploadedImage(imageUrl);
    setMode('custom');
    setShowUploadModal(false);
    resetPractice();
  };

  const switchToPresetMode = () => {
    setMode('preset');
    setCustomText('');
    setUploadedImage('');
    resetPractice();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      {!zenMode && (
        <header className="px-8 py-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate('/')}
                className="text-2xl text-teal-400 hover:text-teal-300 transition-colors"
              >
                typingtest
              </button>
              <button
                onClick={() => navigate('/mock-test')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors"
              >
                Mock Test
              </button>
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
            </div>
            
            {/* Settings Bar - Only show for preset mode */}
            {mode === 'preset' && (
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <button
                  onClick={() => setIncludePunctuation(!includePunctuation)}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    includePunctuation ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-teal-400'
                  }`}
                >
                  #punctuation
                </button>
                <button
                  onClick={() => setIncludeNumbers(!includeNumbers)}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    includeNumbers ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-teal-400'
                  }`}
                >
                  #numbers
                </button>
                <div className="h-6 w-px bg-slate-700"></div>
                <button className="px-3 py-1.5 rounded-md bg-slate-800 text-slate-400 hover:text-teal-400 transition-colors">
                  time
                </button>
                <button className="px-3 py-1.5 rounded-md bg-slate-800 text-slate-400 hover:text-teal-400 transition-colors">
                  quote
                </button>
                <button
                  onClick={() => setZenMode(!zenMode)}
                  className="px-3 py-1.5 rounded-md bg-slate-800 text-slate-400 hover:text-teal-400 transition-colors"
                >
                  zen
                </button>
                <div className="h-6 w-px bg-slate-700"></div>
                {([10, 25, 50, 100] as const).map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      setWordCount(count);
                      resetPractice();
                    }}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      wordCount === count ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-teal-400'
                    }`}
                  >
                    {count}
                  </button>
                ))}
                <div className="h-6 w-px bg-slate-700"></div>
                <button className="px-3 py-1.5 rounded-md bg-slate-800 text-slate-400 hover:text-teal-400 transition-colors">
                  English
                </button>
              </div>
            )}

            {/* Custom mode info */}
            {mode === 'custom' && customText && (
              <div className="bg-teal-950/30 border border-teal-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Image className="w-5 h-5 text-teal-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-teal-300 mb-2">Đang luyện gõ theo bài làm của bạn</p>
                    <p className="text-xs text-slate-400">Sau khi gõ xong, bạn sẽ cần nhập đề bài để AI chấm điểm</p>
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
              </div>

              {/* Virtual Keyboard */}
              <VirtualKeyboard pressedKey={lastPressedKey} />
            </>
          ) : (
            <div className="text-center py-20">
              <Upload className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="text-xl text-slate-400 mb-6">Chọn chế độ luyện tập để bắt đầu</p>
              <Button
                onClick={() => setShowUploadModal(true)}
                className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3"
              >
                <Image className="w-4 h-4 mr-2" />
                Upload Bài Làm
              </Button>
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
        <ImageUploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleImageUpload}
        />
      )}
    </div>
  );
}
