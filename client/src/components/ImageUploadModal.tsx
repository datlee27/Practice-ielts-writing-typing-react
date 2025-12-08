import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';

interface ImageUploadModalProps {
  onClose: () => void;
  onUpload: (text: string, imageUrl: string) => void;
}

export function ImageUploadModal({ onClose, onUpload }: ImageUploadModalProps) {
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setUploadedImage(imageUrl);
        // Simulate OCR processing
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (extractedText.trim()) {
      onUpload(extractedText, uploadedImage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl text-teal-400">Upload Bài Làm IELTS</h2>
            <p className="text-sm text-slate-400 mt-1">Upload ảnh bài viết Task 1 hoặc Task 2 của bạn</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload Area */}
          {!uploadedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600 rounded-lg p-12 text-center cursor-pointer hover:border-teal-500 transition-colors"
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-slate-500" />
              <p className="text-lg text-slate-300 mb-2">Click để upload ảnh</p>
              <p className="text-sm text-slate-500">Hỗ trợ JPG, PNG</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview Image */}
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="w-4 h-4 text-teal-400" />
                  <span className="text-sm text-teal-400">Ảnh đã upload</span>
                </div>
                <img
                  src={uploadedImage}
                  alt="Uploaded essay"
                  className="max-h-64 mx-auto rounded border border-slate-700"
                />
                <button
                  onClick={() => {
                    setUploadedImage('');
                    setExtractedText('');
                  }}
                  className="mt-3 text-sm text-slate-400 hover:text-teal-400 transition-colors"
                >
                  Đổi ảnh khác
                </button>
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Nhập nội dung bài viết của bạn
                  {isProcessing && <span className="ml-2 text-teal-400">(Đang xử lý...)</span>}
                </label>
                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder="Gõ hoặc paste nội dung bài viết từ ảnh vào đây..."
                  className="w-full h-64 bg-slate-900/50 text-white p-4 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  disabled={isProcessing}
                />
                <p className="text-xs text-slate-500 mt-2">
                  Lưu ý: Hiện tại bạn cần tự nhập văn bản. Tính năng OCR tự động sẽ có trong phiên bản sau.
                </p>
              </div>
            </div>
          )}

          {/* Helper text */}
          <div className="bg-teal-950/30 border border-teal-800 rounded-lg p-4">
            <p className="text-sm text-teal-300 mb-2">💡 Hướng dẫn:</p>
            <ol className="text-sm text-slate-400 space-y-1 list-decimal list-inside">
              <li>Upload ảnh bài viết IELTS của bạn (Task 1 hoặc Task 2)</li>
              <li>Nhập nội dung bài viết vào ô text</li>
              <li>Bắt đầu luyện gõ theo bài viết của mình</li>
              <li>Sau khi gõ xong, nhập đề bài để AI chấm điểm</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-slate-700 text-slate-400 hover:bg-slate-800"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!extractedText.trim() || isProcessing}
            className="bg-teal-600 hover:bg-teal-500 text-white"
          >
            Bắt Đầu Luyện Gõ
          </Button>
        </div>
      </div>
    </div>
  );
}
