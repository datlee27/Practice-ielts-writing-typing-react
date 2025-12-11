import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { RotateCcw, Upload, BookOpen, Image, Lock, RefreshCw } from 'lucide-react';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { Button } from '../components/ui/button';
import { ImageUploadModal } from '../components/ImageUploadModal';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';
import React from 'react';
type PracticeMode = 'preset' | 'custom';

export function PracticePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
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
  const [errors, setErrors] = useState<{ position: number; expected: string; actual: string }[]>([]);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<any>(null);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Temporary sample essays until database is properly populated
  const getSampleEssay = (title: string) => {
    const sampleEssays: { [key: string]: string } = {
      'Technology and Communication': 'It is often argued that technological advancements have complicated our lives, whereas others contend that they have simplified them. In my opinion, although technology can be challenging to adapt to initially, it ultimately makes our lives easier in many ways. This essay will discuss both perspectives before presenting my viewpoint.\n\nOn the one hand, there are several reasons why some people believe technology has made life more complicated. Firstly, the rapid pace of technological change means that people constantly need to learn new skills and adapt to new devices. For example, older people often struggle with smartphones and computers, leading to frustration and feelings of inadequacy. Secondly, technology can create new problems such as privacy concerns and cyber security threats. People worry about their personal data being hacked or misused, which adds a layer of complexity to daily life.\n\nOn the other hand, technology has undoubtedly simplified many aspects of modern life. Communication is a prime example; video calls and instant messaging allow us to connect with anyone anywhere at virtually no cost. This has strengthened relationships and made international collaboration easier. Furthermore, technology has automated many tedious tasks. For instance, online banking and shopping apps save time and reduce the need for physical travel, making daily routines more efficient.\n\nIn conclusion, while technology does present some challenges, particularly for those less familiar with it, the benefits far outweigh the drawbacks. The key is to embrace technological change and use it to enhance rather than complicate our lives.',
      'Environmental Protection': 'The government should invest more money in environmental protection rather than in economic development. To what extent do you agree or disagree?\n\nThere is ongoing debate about whether governments should prioritize environmental protection over economic development. While some argue that economic growth should take precedence, I strongly believe that environmental protection is equally important and should be given equal consideration.\n\nThose who favor economic development argue that it provides jobs, raises living standards, and reduces poverty. Developing countries need economic growth to improve infrastructure, healthcare, and education. Furthermore, economic development can fund environmental initiatives once countries become wealthier. For example, many developed nations began serious environmental protection only after achieving economic prosperity.\n\nHowever, I believe environmental protection should not be sacrificed for economic growth. Firstly, environmental degradation has serious long-term consequences. Climate change, deforestation, and pollution threaten human health, agriculture, and biodiversity. The costs of environmental damage often outweigh the benefits of short-term economic gains. Moreover, sustainable development is possible through green technologies and renewable energy, which can create jobs while protecting the environment.\n\nFurthermore, environmental problems do not respect national borders. Actions in one country can affect global climate patterns and ecosystems. International cooperation is essential, and wealthy nations have a responsibility to help developing countries adopt sustainable practices.\n\nIn conclusion, while economic development is important, it should not come at the expense of environmental protection. Governments should pursue sustainable development that balances economic growth with environmental stewardship.',
      'Education System': 'Some people think that schools should focus more on academic subjects while others believe that schools should also teach practical skills. Discuss both views and give your opinion.\n\nThere is considerable debate about whether computers and the internet are more important than traditional schooling for children\'s education. While technology offers numerous advantages, I believe that school teachers remain essential for effective learning.\n\nOn one hand, computers and the internet provide access to vast amounts of information and learning resources. Children can learn at their own pace through interactive online courses and educational websites. Technology also offers personalized learning experiences that adapt to individual needs. Moreover, online education can be more cost-effective and flexible, allowing students to study from anywhere at any time.\n\nHowever, traditional schooling with teachers offers irreplaceable benefits that technology cannot provide. Teachers offer guidance, motivation, and emotional support that are crucial for children\'s development. They can identify when students are struggling and provide personalized attention. Furthermore, schools teach important social skills and foster interaction between students from diverse backgrounds.\n\nIn my view, the most effective education combines both approaches. Technology can enhance traditional learning by providing additional resources and interactive tools. Teachers can use computers to create engaging lessons and help students develop digital literacy skills. The ideal system integrates technology as a tool to support, rather than replace, traditional teaching methods.\n\nTo conclude, while computers and the internet offer valuable educational opportunities, school teachers play an irreplaceable role in children\'s learning. The best approach combines the strengths of both traditional and digital education.',
    };
    return sampleEssays[title] || 'Sample essay not available yet. Please try another prompt or contact support.';
  };

  const sampleText = mode === 'preset'
    ? (currentPrompt?.sampleEssay || getSampleEssay(currentPrompt?.title || '') || "Loading practice text...")
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
      const response = await apiClient.getRandomPrompts(10, 'task2');
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
    setErrors([]);
    setTotalKeystrokes(0);
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
                <button
                  onClick={getRandomPrompt}
                  disabled={loadingPrompts}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 text-slate-400 hover:text-teal-400 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingPrompts ? 'animate-spin' : ''}`} />
                  <span>Random</span>
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
        <ImageUploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleImageUpload}
        />
      )}
    </div>
  );
}