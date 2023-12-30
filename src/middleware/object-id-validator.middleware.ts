import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/http-status.constants";
import { INVALID_ID } from "../constants/messages.constants";

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
        res.status(HTTP_STATUS.BAD_REQUEST).send({ message: INVALID_ID });
    }

}

function isValidObjectId(id: string) {
    // MongoDB ObjectID is a 24-character hexadecimal string
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
  }