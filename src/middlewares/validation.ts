import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi, { ValidationOptions, ValidationError } from 'joi';

function validationMiddleware(schema: Joi.Schema): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const validationOptions: ValidationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };
    try {
      const value = await schema.validateAsync(req.body, validationOptions);
      req.body = value;
      next();
    } catch (error: any) {
      if (error.details && Array.isArray(error.details)) {
        const errors: string[] = error.details.map(
          (error: Joi.ValidationErrorItem) => {
            return error.message;
          }
        );
        res.status(400).json({ errors, message: 'Validations Failed' });
      } else {
        res
          .status(500)
          .json({ errors: [error.message], message: 'Something went wrong' });
      }
    }
  };
}

export default validationMiddleware;
