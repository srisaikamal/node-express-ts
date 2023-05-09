import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import path from 'path';

export const validateSingleFileUploadMiddleware = (
  key: string,
  accceptedExtensions: string[]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.files);
    if (!req.files || !Object.keys(req.files).length) {
      return res.status(422).json({
        message: 'Files Validation error',
        errors: ['Please upload a file'],
      });
    }
    if (Array.isArray(req.files[key])) {
      return res.status(422).json({
        message: 'Files Validation error',
        errors: ['Please upload only single file'],
      });
    }
    const file = req.files[key] as UploadedFile;

    if (!accceptedExtensions.includes(path.extname(file?.name))) {
      return res.status(422).json({
        message: 'Files Validation error',
        errors: ['Please upload valid file'],
      });
    }

    const filePath = path.join(
      __dirname,
      new Date().getTime() + '-' + file.name
    );

    file
      .mv(filePath)
      .then(() => {
        req.filePath = filePath;
        next();
      })
      .catch((err) => {
        return res.status(500).json({
          message: err,
          errors: ['unable to upload file'],
        });
      });
  };
};
