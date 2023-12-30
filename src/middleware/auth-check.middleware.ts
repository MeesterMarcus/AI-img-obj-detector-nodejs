import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/http-status.constants';
import { MISSING_AUTH } from '../constants/messages.constants';

export function checkAuthorization(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.headers.authorization) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: MISSING_AUTH });
  }
  next(); // Continue to the next middleware or route handler
}
