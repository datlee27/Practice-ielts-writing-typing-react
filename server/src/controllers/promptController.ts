import { Request, Response } from 'express';
import { Prompt } from '../models';
import { validationResult } from 'express-validator';

export class PromptController {
  static async getAllPrompts(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        taskType,
        difficulty,
        category,
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      const where: any = { isActive: true };

      if (taskType && (taskType === 'task1' || taskType === 'task2')) {
        where.taskType = taskType;
      }

      if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty as string)) {
        where.difficulty = difficulty;
      }

      if (category) {
        where.category = category;
      }

      const prompts = await Prompt.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['createdAt', 'DESC']],
      });

      res.json({
        data: prompts.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: prompts.count,
          totalPages: Math.ceil(prompts.count / Number(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getPromptById(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.body.errors = errors.array();
        return;
      }

      const { id } = req.params;

      const prompt = await Prompt.findByPk(id);

      if (!prompt || !prompt.isActive) {
        res.status(404).json({ message: 'Prompt not found' });
        return;
      }

      res.json({ data: prompt });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getRandomPrompts(req: Request, res: Response): Promise<void> {
    try {
      const { count = 5, taskType } = req.query;

      const where: any = { isActive: true };

      if (taskType && (taskType === 'task1' || taskType === 'task2')) {
        where.taskType = taskType;
      }

      const prompts = await Prompt.findAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: Number(count),
      });

      res.json({ data: prompts });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}