import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../constants/http-status.constants';
import { AUTH_FAILED, MISSING_AUTH } from '../constants/messages.constants';

export const authenticateImagga = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!process.env.AUTHORIZATION) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: MISSING_AUTH });
  }
  try {
    const authorizationHeader = process.env.AUTHORIZATION;
    req.headers.authorization = authorizationHeader;
    next();
  } catch (error) {
    return res.status(500).json({ message: AUTH_FAILED });
  }
};
