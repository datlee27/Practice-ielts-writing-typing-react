import fs from 'fs/promises';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import { OCRService } from './ocrService';

export type SupportedFileType = 'image' | 'pdf' | 'doc' | 'docx' | 'txt';

export interface FileProcessingResult {
  extractedText: string;
  fileType: SupportedFileType;
}

export class FileProcessingService {
  static async processFile(filePath: string, mimeType: string): Promise<FileProcessingResult> {
    const fileType = this.getFileType(mimeType);

    switch (fileType) {
      case 'txt':
        return this.processTextFile(filePath);
      case 'pdf':
        return this.processPDFFile(filePath);
      case 'docx':
        return this.processDOCXFile(filePath);
      case 'doc':
        return this.processDOCFile(filePath);
      case 'image':
        return this.processImageFile(filePath);
      default:
        throw new Error('Unsupported file type');
    }
  }

  private static getFileType(mimeType: string): SupportedFileType {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType === 'application/msword') return 'doc';
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
    if (mimeType === 'text/plain') return 'txt';
    throw new Error('Unsupported file type');
  }

  private static async processTextFile(filePath: string): Promise<FileProcessingResult> {
    const content = await fs.readFile(filePath, 'utf-8');
    return {
      extractedText: content.trim(),
      fileType: 'txt',
    };
  }

  private static async processPDFFile(filePath: string): Promise<FileProcessingResult> {
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await (pdfParse as unknown as (data: Buffer) => Promise<{ text: string }>)(dataBuffer);
    return {
      extractedText: pdfData.text.trim(),
      fileType: 'pdf',
    };
  }

  private static async processDOCXFile(filePath: string): Promise<FileProcessingResult> {
    const result = await mammoth.extractRawText({ path: filePath });
    return {
      extractedText: result.value.trim(),
      fileType: 'docx',
    };
  }

  private static async processDOCFile(filePath: string): Promise<FileProcessingResult> {
    try {
      // Use require to avoid TypeScript issues with textract
      const textractLib = require('textract');
      const text: string = await new Promise((resolve, reject) => {
        textractLib.fromFileWithPath(filePath, (error: Error | null, result?: string) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result || '');
        });
      });

      if (!text || text.trim().length < 10) {
        throw new Error('Unable to extract text from DOC file. Please convert to DOCX or PDF format.');
      }

      const cleaned = text.replace(/\s+\n/g, '\n').trim();
      return {
        extractedText: cleaned,
        fileType: 'doc',
      };
    } catch (error) {
      if (error instanceof Error) {
        // Provide helpful error message for missing system dependencies
        if (error.message.includes('command not found') || error.message.includes('ENOENT')) {
          throw new Error('DOC file processing requires system dependencies. Please convert your file to DOCX or PDF format, or install LibreOffice/antiword.');
        }
        throw new Error(`Failed to process DOC file: ${error.message}. Please convert to DOCX or PDF format.`);
      }
      throw new Error('Failed to process DOC file. Please convert to DOCX or PDF format.');
    }
  }

  private static async processImageFile(filePath: string): Promise<FileProcessingResult> {
    const ocrResult = await OCRService.processUploadedImage(filePath);
    return {
      extractedText: ocrResult.text,
      fileType: 'image',
    };
  }
}

