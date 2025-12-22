import { useRef, useState } from 'react';
import { X, Upload, FileText, Image as ImageIcon, File } from 'lucide-react';
import { Button } from './ui/button';
import apiClient from '../services/api';

interface FileUploadModalProps {
  onClose: () => void;
  onUpload: (data: {
    sampleEssay: string;
    title: string;
    content: string;
    taskType: 'task1' | 'task2';
    category: string;
    fileUrl?: string;
  }) => void;
  onSave?: (data: {
    sampleEssay: string;
    title: string;
    content: string;
    taskType: 'task1' | 'task2';
    category: string;
    fileUrl?: string;
  }) => void;
}

export function FileUploadModal({ onClose, onUpload, onSave }: FileUploadModalProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [taskType, setTaskType] = useState<'task1' | 'task2'>('task2');
  const [category, setCategory] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

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
  });

  const handleSubmit = () => {
    if (!extractedText.trim()) {
      setError('Vui lòng upload file để lấy nội dung.');
      return;
    }
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề.');
      return;
    }
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung đề bài.');
      return;
    }
    if (!category.trim()) {
      setError('Vui lòng nhập category.');
      return;
    }

    onUpload(buildPayload());
  };

  const handleSaveOnly = () => {
    if (!onSave) return;
    if (!extractedText.trim() || !title.trim() || !content.trim() || !category.trim()) {
      setError('Vui lòng điền đầy đủ thông tin để lưu.');
      return;
    }
    onSave(buildPayload());
  };

  const getFileIcon = () => {
    if (!uploadedFile) return <Upload className="w-12 h-12 mx-auto mb-4 text-slate-500" />;
    if (uploadedFile.type.startsWith('image/')) return <ImageIcon className="w-12 h-12 mx-auto mb-4 text-teal-400" />;
    if (uploadedFile.type === 'application/pdf') return <FileText className="w-12 h-12 mx-auto mb-4 text-red-400" />;
    return <File className="w-12 h-12 mx-auto mb-4 text-blue-400" />;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl text-teal-400">Upload Bài Làm IELTS</h2>
            <p className="text-sm text-slate-400 mt-1">
              Hỗ trợ PDF, DOC, DOCX, TXT, JPG, PNG, WebP hoặc ảnh chụp từ điện thoại
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close upload modal"
          >
            <X className="w-6 h-6" />
          </button>
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
                    onClick={() => {
                      setUploadedFile(null);
                      setFilePreview('');
                      setExtractedText('');
                      setError('');
                    }}
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
          {onSave && (
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
          )}
          <Button
            onClick={onClose}
            variant="outline"
            className="border-slate-700 text-slate-400 hover:bg-slate-800"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
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
    </div>
  );
}

