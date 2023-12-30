import { Request } from 'express';

export function parseQueryObjects(req: Request): string[] {
  if (req.query.objects && typeof req.query.objects === 'string') {
    return req.query.objects.split(',');
  }
  return [];
}
