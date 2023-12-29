import { Request, Response, NextFunction } from 'express';

export function basicAuth(req: Request, res: Response, next: NextFunction) {
  // Check if the Authorization header is present
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }
  
  // If the Authorization header is present, proceed to the next middleware or route handler
  next();
}
