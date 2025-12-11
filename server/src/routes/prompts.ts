import { Router } from 'express';
import { PromptController } from '../controllers/promptController';
import { validatePromptId, validatePagination } from '../middleware/validation';
import { handleValidationErrors } from '../middleware/errorHandler';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get(
  '/',
  optionalAuth,
  validatePagination,
  handleValidationErrors,
  PromptController.getAllPrompts
);

router.get('/random', optionalAuth, PromptController.getRandomPrompts);

router.post('/populate-sample-essays', PromptController.populateSampleEssays);

router.get(
  '/:id',
  optionalAuth,
  validatePromptId,
  handleValidationErrors,
  PromptController.getPromptById
);

export default router;