import { Router } from 'express';
import { EssayController } from '../controllers/essayController';
import { validatePagination } from '../middleware/validation';
import { handleValidationErrors } from '../middleware/errorHandler';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();

router.post(
  '/upload',
  optionalAuth,
  EssayController.uploadMiddleware,
  EssayController.uploadEssayImage
);

router.post(
  '/',
  optionalAuth,
  EssayController.submitEssay
);

router.post('/:essayId/score', authenticateToken, EssayController.scoreEssay);

router.get(
  '/',
  authenticateToken,
  validatePagination,
  handleValidationErrors,
  EssayController.getUserEssays
);

router.get('/stats', authenticateToken, EssayController.getEssayStats);

router.get('/:id', authenticateToken, EssayController.getEssayById);

export default router;