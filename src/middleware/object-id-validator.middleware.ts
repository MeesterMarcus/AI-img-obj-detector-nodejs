import { Request, Response, NextFunction } from "express";

/**
 * Ensure that the passed in query parameters are valid
 * @param req : Request
 * @param res : Response
 * @param next : NextFunction
 */
export function validateObjectId(req: Request, res: Response, next: NextFunction): void {
    const id = req.params.id
    if (isValidObjectId(id)) {
        next();
    } else {
        res.status(400).send({ message: 'Invalid request: the id provided is not a correct MongoDB object id.' });
    }

}

function isValidObjectId(id: string) {
    // MongoDB ObjectID is a 24-character hexadecimal string
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
  }