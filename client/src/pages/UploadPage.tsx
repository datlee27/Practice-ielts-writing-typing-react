import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload, FileText, Image as ImageIcon, File, Lock, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/button';
import apiClient, { Essay } from '../services/api';

export function UploadPage() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [taskType, setTaskType] = useState<'task1' | 'task2'>('task2');
  const [category, setCategory] = useState('');
  const [savedUploads, setSavedUploads] = useState<Array<Essay & { promptRef?: any }>>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadSaved = async () => {
      try {
        setIsLoadingSaved(true);
        const data = await apiClient.getSavedEssays();
        setSavedUploads(data);
      } catch (err) {
        console.error('Failed to load saved uploads', err);
      } finally {
        setIsLoadingSaved(false);
      }
    };
    loadSaved();
  }, []);

  const groupedSavedUploads = useMemo<Record<string, Record<string, (Essay & { promptRef?: any })[]>>>(() => {
    const groups: Record<string, Record<string, (Essay & { promptRef?: any })[]>> = {};
    savedUploads.forEach(upload => {
      const taskKey = upload.taskType === 'task1' ? 'Task 1' : 'Task 2';
      const categoryKey = upload.promptRef?.category || 'Chưa phân loại';
      if (!groups[taskKey]) {
        groups[taskKey] = {};
      }
      if (!groups[taskKey][categoryKey]) {
        groups[taskKey][categoryKey] = [];
      }
      groups[taskKey][categoryKey].push(upload);
    });
    return groups;
  }, [savedUploads]);

  const resetForm = () => {
    setUploadedFile(null);
    setFilePreview('');
    setExtractedText('');
    setTitle('');
    setContent('');
    setTaskType('task2');
    setCategory('');
    setError('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploadedFile(file);
    setExtractedText('');

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview('');
    }

    setIsProcessing(true);
    try {
      const result = await apiClient.uploadEssayFile(file);
      setExtractedText(result.extractedText);
      if (result.fileUrl) {
        setFilePreview(result.fileUrl);
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to process file';
      setError(message);
      setUploadedFile(null);
      setFilePreview('');
    } finally {
      setIsProcessing(false);
    }
  };

  const buildPayload = () => ({
    sampleEssay: extractedText,
    title,
    content,
    taskType,
    category,
    fileUrl: filePreview || undefined,
    wordCount: extractedText.split(/\s+/).filter(Boolean).length,
    difficulty: 'medium' as const,
    timeLimit: taskType === 'task1' ? 20 : 40,
  });

  const validateRequired = () => {
    if (!extractedText.trim()) {
      setError('Vui lòng upload file để lấy nội dung.');
      return false;
    }
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề.');
      return false;
    }
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung đề bài.');
      return false;
    }
    if (!category.trim()) {
      setError('Vui lòng nhập category.');
      return false;
    }
    return true;
  };

  const handleSaveOnly = async () => {
    if (!validateRequired()) return;
    try {
      await apiClient.saveUploadAndCreatePrompt(buildPayload());
      const data = await apiClient.getSavedEssays();
      setSavedUploads(data);
      resetForm();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Không thể lưu bài lên server';
      setError(message);
    }
  };

  const handleStartPractice = async () => {
    if (!validateRequired()) return;
    try {
      const result = await apiClient.saveUploadAndCreatePrompt(buildPayload());
      const essayId = result.essay.id;
      const data = await apiClient.getSavedEssays();
      setSavedUploads(data);
      navigate('/practice', { state: { savedUploadId: essayId?.toString?.() || essayId } });
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Không thể lưu bài lên server';
      setError(message);
    }
  };

  const getFileIcon = () => {
    if (!uploadedFile) return <Upload className="w-12 h-12 mx-auto mb-4 text-slate-500" />;
    if (uploadedFile.type.startsWith('image/')) return <ImageIcon className="w-12 h-12 mx-auto mb-4 text-teal-400" />;
    if (uploadedFile.type === 'application/pdf') return <FileText className="w-12 h-12 mx-auto mb-4 text-red-400" />;
    return <File className="w-12 h-12 mx-auto mb-4 text-blue-400" />;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-2xl text-teal-400 hover:text-teal-300 transition-colors"
          >
            typingtest
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/practice')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Quay lại luyện gõ
            </button>
            <button
              onClick={resetForm}
              className="px-3 py-2 text-slate-400 hover:text-teal-300 rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset form
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg">
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl text-teal-300 font-semibold">Upload Bài Làm IELTS</h1>
            <p className="text-sm text-slate-400 mt-1">
              Hỗ trợ PDF, DOC, DOCX, TXT, JPG, PNG, WebP hoặc ảnh chụp từ điện thoại
            </p>
          </div>

          <div className="p-6 space-y-6">
            {!uploadedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-600 rounded-lg p-12 text-center cursor-pointer hover:border-teal-500 transition-colors"
              >
                {getFileIcon()}
                <p className="text-lg text-slate-300 mb-2">Click để upload file</p>
                <p className="text-sm text-slate-500">Hỗ trợ: PDF, DOC, DOCX, TXT, JPG, PNG, WebP</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {uploadedFile.type.startsWith('image/') ? (
                        <ImageIcon className="w-4 h-4 text-teal-400" />
                      ) : (
                        <FileText className="w-4 h-4 text-teal-400" />
                      )}
                      <span className="text-sm text-teal-400">File đã upload</span>
                    </div>
                    <button
                      onClick={resetForm}
                      className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
                    >
                      Đổi file khác
                    </button>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{uploadedFile.name}</p>
                  {filePreview && uploadedFile.type.startsWith('image/') && (
                    <img
                      src={filePreview}
                      alt="Uploaded preview"
                      className="max-h-64 mx-auto rounded border border-slate-700 mt-3"
                    />
                  )}
                  {isProcessing && (
                    <p className="text-sm text-teal-400 mt-2">Đang xử lý file...</p>
                  )}
                </div>

                {extractedText && (
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      Nội dung đã extract (sampleEssay)
                    </label>
                    <textarea
                      value={extractedText}
                      onChange={(e) => setExtractedText(e.target.value)}
                      className="w-full h-48 bg-slate-900/50 text-white p-4 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Bạn có thể chỉnh sửa nội dung này trước khi luyện gõ
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Tiêu đề (Title) *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Nhập tiêu đề đề bài"
                      className="w-full bg-slate-900/50 text-white p-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Task Type *</label>
                    <select
                      value={taskType}
                      onChange={(e) => setTaskType(e.target.value as 'task1' | 'task2')}
                      className="w-full bg-slate-900/50 text-white p-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="task1">Task 1</option>
                      <option value="task2">Task 2</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Nội dung đề bài (Content) *</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập nội dung đề bài IELTS"
                    className="w-full h-32 bg-slate-900/50 text-white p-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Category *</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ví dụ: Education, Environment, Technology..."
                    className="w-full bg-slate-900/50 text-white p-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
            <Button
              onClick={handleSaveOnly}
              disabled={
                !extractedText.trim() ||
                isProcessing ||
                !title.trim() ||
                !content.trim() ||
                !category.trim()
              }
              variant="outline"
              className="border-slate-700 text-teal-300 hover:text-teal-200 hover:border-teal-500"
            >
              Lưu Bài
            </Button>
            <Button
              onClick={handleStartPractice}
              disabled={
                !extractedText.trim() ||
                isProcessing ||
                !title.trim() ||
                !content.trim() ||
                !category.trim()
              }
              className="bg-teal-600 hover:bg-teal-500 text-white"
            >
              Bắt Đầu Luyện Gõ
            </Button>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm uppercase text-slate-500 tracking-wide">Bài làm đã lưu</p>
              <p className="text-2xl text-white font-semibold mt-1">{savedUploads.length}</p>
            </div>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:text-white"
              onClick={() => navigate('/practice')}
            >
              Quay lại luyện gõ
            </Button>
          </div>

          {isLoadingSaved ? (
            <p className="text-sm text-slate-500">Đang tải danh sách...</p>
          ) : savedUploads.length === 0 ? (
            <p className="text-sm text-slate-500">Chưa có bài nào được lưu.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(groupedSavedUploads as Record<string, Record<string, (Essay & { promptRef?: any })[]>>).map(([taskLabel, categories]) => (
                <div
                  key={taskLabel}
                  className="bg-slate-900/60 border border-slate-700 rounded-lg p-3"
                >
                  <div className="text-sm text-teal-300 font-semibold mb-2">{taskLabel}</div>
                  <div className="space-y-2">
                    {Object.entries(categories as Record<string, (Essay & { promptRef?: any })[]>).map(([categoryLabel, essays]) => (
                      <div key={categoryLabel}>
                        <div className="text-xs text-slate-400 mb-1">Category: {categoryLabel}</div>
                        <div className="flex flex-wrap gap-2">
                          {essays.map((essay) => (
                            <button
                              key={essay.id}
                              onClick={() => navigate('/practice', { state: { savedUploadId: essay.id } })}
                              className="group px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 hover:border-teal-500 hover:bg-slate-800 transition-colors text-left"
                            >
                              <div className="text-sm text-white">{essay.promptRef?.title || 'Untitled'}</div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                                  {essay.promptRef?.category || 'N/A'}
                                </span>
                                {essay.practiced ? (
                                  <span className="px-2 py-0.5 rounded-full bg-teal-900/60 text-teal-200">
                                    Đã luyện
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-900/50 text-amber-200">
                                    Chưa luyện
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

