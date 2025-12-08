import { Request, Response } from 'express';
import { Test } from '../models';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';

export class TestController {
  static async submitTest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.body.errors = errors.array();
        return;
      }

      const testData = {
        ...req.body,
        userId: req.user?.id,
        completedAt: new Date(),
      };

      const test = await Test.create(testData);

      res.status(201).json({
        message: 'Test result saved successfully',
        data: test,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getUserTests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        testType,
        mode,
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      const where: any = { userId: req.user?.id };

      if (testType && ['practice', 'mock', 'custom'].includes(testType as string)) {
        where.testType = testType;
      }

      if (mode && ['preset', 'custom'].includes(mode as string)) {
        where.mode = mode;
      }

      const tests = await Test.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['completedAt', 'DESC']],
        include: ['prompt'],
      });

      res.json({
        data: tests.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: tests.count,
          totalPages: Math.ceil(tests.count / Number(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getTestById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.body.errors = errors.array();
        return;
      }

      const { id } = req.params;

      const test = await Test.findOne({
        where: {
          id,
          userId: req.user?.id,
        },
        include: ['prompt'],
      });

      if (!test) {
        res.status(404).json({ message: 'Test not found' });
        return;
      }

      res.json({ data: test });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getTestStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      const stats = await Test.findAll({
        where: { userId },
        attributes: [
          'testType',
          [Test.sequelize!.fn('COUNT', Test.sequelize!.col('id')), 'count'],
          [Test.sequelize!.fn('AVG', Test.sequelize!.col('wpm')), 'avgWpm'],
          [Test.sequelize!.fn('AVG', Test.sequelize!.col('accuracy')), 'avgAccuracy'],
          [Test.sequelize!.fn('MAX', Test.sequelize!.col('wpm')), 'maxWpm'],
          [Test.sequelize!.fn('MAX', Test.sequelize!.col('accuracy')), 'maxAccuracy'],
        ],
        group: ['testType'],
        raw: true,
      });

      res.json({ data: stats });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteTest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deletedRowsCount = await Test.destroy({
        where: {
          id,
          userId: req.user?.id,
        },
      });

      if (deletedRowsCount === 0) {
        res.status(404).json({ message: 'Test not found' });
        return;
      }

      res.json({ message: 'Test deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}