import { Request, Response } from 'express';
import { Essay } from '../models';
import { AIScoringService } from '../services/aiScoringService';
import { OCRService } from '../services/ocrService';
import { FileProcessingService } from '../services/fileProcessingService';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPG, PNG, WebP), PDF, DOC, DOCX, and TXT files are allowed'));
    }
  },
});

export class EssayController {
  static uploadMiddleware = upload.single('file');

  static async uploadEssayFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file provided' });
        return;
      }

      const processingResult = await FileProcessingService.processFile(
        req.file.path,
        req.file.mimetype
      );

      await OCRService.cleanupTempFile(req.file.path);

      const isImage = req.file.mimetype.startsWith('image/');

      res.json({
        message: 'File processed successfully',
        data: {
          extractedText: processingResult.extractedText,
          fileType: processingResult.fileType,
          fileUrl: isImage ? `/uploads/${req.file.filename}` : undefined,
          fileName: req.file.originalname,
        },
      });
    } catch (error) {
      if (req.file) {
        await OCRService.cleanupTempFile(req.file.path);
      }

      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async submitEssay(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.body.errors = errors.array();
        return;
      }

      const essayData = {
        ...req.body,
        userId: req.user?.id,
      };

      const essay = await Essay.create(essayData);

      res.status(201).json({
        message: 'Essay submitted successfully',
        data: essay,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async scoreEssay(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { essayId } = req.params;

      const essay = await Essay.findOne({
        where: {
          id: essayId,
          userId: req.user?.id,
        },
      });

      if (!essay) {
        res.status(404).json({ message: 'Essay not found' });
        return;
      }

      if (essay.isScored) {
        res.status(400).json({ message: 'Essay has already been scored' });
        return;
      }

      const scoringResult = await AIScoringService.scoreEssay(
        essay.essayText,
        essay.prompt,
        essay.taskType,
        essay.wordCount
      );

      await essay.update({
        ...scoringResult.criteria,
        overallBand: scoringResult.overallBand,
        feedback: scoringResult.feedback,
        isScored: true,
        scoredAt: new Date(),
      });

      res.json({
        message: 'Essay scored successfully',
        data: {
          ...essay.toJSON(),
          ...scoringResult,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getUserEssays(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        taskType,
        isScored,
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      const where: any = { userId: req.user?.id };

      if (taskType && (taskType === 'task1' || taskType === 'task2')) {
        where.taskType = taskType;
      }

      if (isScored !== undefined) {
        where.isScored = isScored === 'true';
      }

      const essays = await Essay.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['createdAt', 'DESC']],
      });

      res.json({
        data: essays.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: essays.count,
          totalPages: Math.ceil(essays.count / Number(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getEssayById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const essay = await Essay.findOne({
        where: {
          id,
          userId: req.user?.id,
        },
      });

      if (!essay) {
        res.status(404).json({ message: 'Essay not found' });
        return;
      }

      res.json({ data: essay });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getEssayStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      const stats = await Essay.findAll({
        where: { userId, isScored: true },
        attributes: [
          'taskType',
          [Essay.sequelize!.fn('COUNT', Essay.sequelize!.col('id')), 'count'],
          [Essay.sequelize!.fn('AVG', Essay.sequelize!.col('overallBand')), 'avgBand'],
          [Essay.sequelize!.fn('MAX', Essay.sequelize!.col('overallBand')), 'maxBand'],
          [Essay.sequelize!.fn('AVG', Essay.sequelize!.col('taskResponseScore')), 'avgTaskResponse'],
          [Essay.sequelize!.fn('AVG', Essay.sequelize!.col('coherenceScore')), 'avgCoherence'],
          [Essay.sequelize!.fn('AVG', Essay.sequelize!.col('lexicalResourceScore')), 'avgLexical'],
          [Essay.sequelize!.fn('AVG', Essay.sequelize!.col('grammarScore')), 'avgGrammar'],
        ],
        group: ['taskType'],
        raw: true,
      });

      res.json({ data: stats });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}