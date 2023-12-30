import { Response } from 'express';
import { HTTP_STATUS } from '../constants/http-status.constants';
import {
  IMAGE_FILE_NOT_FOUND,
  IMAGE_NOT_FOUND,
  IMAGE_PROCESSING_FAILED,
} from '../constants/messages.constants';

export const handleImageServiceError = (error: Error, res: Response) => {
  const msg = error.message;

  switch (msg) {
    case IMAGE_FILE_NOT_FOUND:
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send({ message: IMAGE_FILE_NOT_FOUND });
    case IMAGE_NOT_FOUND:
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send({ message: IMAGE_NOT_FOUND });
    default:
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(IMAGE_PROCESSING_FAILED);
  }
};
