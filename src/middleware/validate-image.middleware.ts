import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/http-status.constants';
import { IMAGE_FILE_TYPE_UNSUPPORTED } from '../constants/messages.constants';
import { isValidImage } from '../lib/valid-image';

export function validateImage(req: Request, res: Response, next: NextFunction) {
  const imageSource = req.body.imageSource;
  if (!isValidImage(imageSource)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({
      message: IMAGE_FILE_TYPE_UNSUPPORTED,
    });
  }
  next();
}
