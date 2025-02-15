import { Schema } from 'joi';
import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware for validating request body using Joi schema.
*/

export const validateBody = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (!!error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: error.details[0].message
      });
    }
    
    next();
  };
};