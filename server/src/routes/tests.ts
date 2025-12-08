import { Router } from 'express';
import { TestController } from '../controllers/testController';
import { validateTestResult, validateTestId, validatePagination } from '../middleware/validation';
import { handleValidationErrors } from '../middleware/errorHandler';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();

router.post(
  '/',
  optionalAuth,
  validateTestResult,
  handleValidationErrors,
  TestController.submitTest
);

router.get(
  '/',
  authenticateToken,
  validatePagination,
  handleValidationErrors,
  TestController.getUserTests
);

router.get('/stats', authenticateToken, TestController.getTestStats);

router.get(
  '/:id',
  authenticateToken,
  validateTestId,
  handleValidationErrors,
  TestController.getTestById
);

router.delete(
  '/:id',
  authenticateToken,
  validateTestId,
  handleValidationErrors,
  TestController.deleteTest
);

export default router;