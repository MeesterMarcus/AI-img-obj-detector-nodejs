import { Request, Response, NextFunction } from "express";

export function basicAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = process.env.API_KEY || 'defaultApiKey';
  const apiSecret = process.env.API_SECRET || 'defaultApiSecret';

  const authKey = `${apiKey}:${apiSecret}`;
  const base64Auth = Buffer.from(authKey).toString('base64');

  // Attach the encoded auth credentials to the request object
  req.headers.authorization = `Basic ${base64Auth}`;
  
  next();
}