import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation';
import { handleValidationErrors } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post(
  '/register',
  validateUserRegistration,
  handleValidationErrors,
  AuthController.register
);

router.post(
  '/login',
  validateUserLogin,
  handleValidationErrors,
  AuthController.login
);

router.get('/profile', authenticateToken, AuthController.getProfile);

export default router;