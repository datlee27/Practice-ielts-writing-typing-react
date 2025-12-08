import { body, param, query, ValidationChain } from 'express-validator';

export const validateUserRegistration: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be between 1 and 100 characters'),
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be between 1 and 100 characters'),
];

export const validateUserLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const validateTestResult: ValidationChain[] = [
  body('userInput')
    .notEmpty()
    .withMessage('User input is required'),
  body('wpm')
    .isFloat({ min: 0 })
    .withMessage('WPM must be a positive number'),
  body('accuracy')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Accuracy must be between 0 and 100'),
  body('timeSpent')
    .isInt({ min: 0 })
    .withMessage('Time spent must be a positive integer'),
  body('wordCount')
    .isInt({ min: 0 })
    .withMessage('Word count must be a positive integer'),
  body('testType')
    .isIn(['practice', 'mock', 'custom'])
    .withMessage('Invalid test type'),
  body('mode')
    .isIn(['preset', 'custom'])
    .withMessage('Invalid mode'),
];

export const validateEssaySubmission: ValidationChain[] = [
  body('prompt')
    .notEmpty()
    .withMessage('Prompt is required'),
  body('taskType')
    .isIn(['task1', 'task2'])
    .withMessage('Task type must be task1 or task2'),
  body('essayText')
    .notEmpty()
    .withMessage('Essay text is required'),
  body('wordCount')
    .isInt({ min: 0 })
    .withMessage('Word count must be a positive integer'),
];

export const validatePromptId: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Prompt ID must be a positive integer'),
];

export const validateTestId: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Test ID must be a positive integer'),
];

export const validatePagination: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];