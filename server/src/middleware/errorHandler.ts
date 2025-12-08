import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = req.body?.errors || [];

  if (errors.length > 0) {
    res.status(400).json({
      message: 'Validation failed',
      errors: errors.map((error: any) => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value,
      })),
    });
    return;
  }

  next();
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);

  if (err.name === 'SequelizeValidationError') {
    res.status(400).json({
      message: 'Validation error',
      errors: (err as any).errors?.map((e: any) => ({
        field: e.path,
        message: e.message,
        value: e.value,
      })),
    });
    return;
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    res.status(409).json({
      message: 'Duplicate entry',
      errors: (err as any).errors?.map((e: any) => ({
        field: e.path,
        message: `${e.path} already exists`,
      })),
    });
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ message: 'Token expired' });
    return;
  }

  res.status(500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
};