import { createWorker, PSM } from 'tesseract.js';
import path from 'path';
import fs from 'fs/promises';

export class OCRService {
  static async extractTextFromImage(imagePath: string): Promise<string> {
    const worker = await createWorker('eng');

    try {
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .,!?-()[]{}:;"\'',
        tessedit_pageseg_mode: 6 as any,
      });

      const { data: { text } } = await worker.recognize(imagePath);
      return text.trim();
    } finally {
      await worker.terminate();
    }
  }

  static async processUploadedImage(filePath: string): Promise<{
    text: string;
    confidence?: number;
  }> {
    try {
      await fs.access(filePath);
      const text = await this.extractTextFromImage(filePath);

      if (!text || text.length < 10) {
        throw new Error('Unable to extract sufficient text from image. Please ensure the image contains clear, readable text.');
      }

      return { text };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`OCR processing failed: ${error.message}`);
      }
      throw new Error('OCR processing failed');
    }
  }

  static validateImageFile(file: Express.Multer.File): void {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Only JPEG, PNG, and WebP images are allowed');
    }

    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760');
    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
    }
  }

  static async cleanupTempFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn(`Failed to cleanup temp file ${filePath}:`, error);
    }
  }
}