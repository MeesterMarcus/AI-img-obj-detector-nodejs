import { Response } from 'express';
import { HTTP_STATUS } from '../constants/http-status.constants';
import {
  IMAGE_FILE_NOT_FOUND,
  IMAGE_PROCESSING_FAILED,
} from '../constants/messages.constants';

// Create a function to handle errors and send responses
export const handleImageServiceError = (error: Error, res: Response) => {
  const msg = error.message;

  if (msg === IMAGE_FILE_NOT_FOUND) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send({ message: IMAGE_FILE_NOT_FOUND });
  } else {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(IMAGE_PROCESSING_FAILED);
  }
};
