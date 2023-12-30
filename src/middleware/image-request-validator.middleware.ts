import { Request, Response, NextFunction } from 'express';
import { ImagesGetQueryParams } from '../models/image-metadata';
import { HTTP_STATUS } from '../constants/http-status.constants';
import { INVALID_REQUEST_OBJECTS_VALUE, INVALID_REQUEST_OBJECTS } from '../constants/response-messages.constants';

/**
 * Ensure that the passed in query parameters are valid
 * @param req : Request
 * @param res : Response
 * @param next : NextFunction
 */
export function validateImageGetParams(req: Request, res: Response, next: NextFunction): void {
    const qsParams: ImagesGetQueryParams = req.query;

    // Verify qsParams is either empty or contains only the key 'objects'
    const keys = Object.keys(qsParams);
    if (keys.length === 0 || (keys.length === 1 && keys.includes('objects'))) {
        // If objects key exists, validate it; otherwise, allow empty qsParams
        if (!qsParams.objects || isValidImageGetParams(qsParams)) {
            next();
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({message: INVALID_REQUEST_OBJECTS_VALUE});
        }
    } else {
        res.status(HTTP_STATUS.BAD_REQUEST).send({message: INVALID_REQUEST_OBJECTS});
    }
}

/**
 * Validate the 'objects' param
 * @param param 
 * @returns boolean
 */
const isValidImageGetParams = (param: ImagesGetQueryParams) => {
    const values = param.objects;
    try {
        const valuesArr = values?.split(',');
        if (valuesArr) {
            for (const val of valuesArr) {
                if (typeof val !== 'string') {
                    return false;
                }
            }
        }
        return true;
    } catch (error: unknown) {
        return false;
    }
}
