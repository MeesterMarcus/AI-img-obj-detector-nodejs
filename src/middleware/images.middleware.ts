import { Request, Response, NextFunction } from 'express';
import { ImagesGetRequestParams } from '../models/images.models';

export function validateImageGetParams(req: Request, res: Response, next: NextFunction): void {
    const qsParams: ImagesGetRequestParams = req.query;

    // Verify qsParams is either empty or contains only the key 'objects'
    const keys = Object.keys(qsParams);
    if (keys.length === 0 || (keys.length === 1 && keys.includes('objects'))) {
        // If objects key exists, validate it; otherwise, allow empty qsParams
        if (!qsParams.objects || isValidImageGetParams(qsParams)) {
            next();
        } else {
            res.status(400).send('Invalid request: Invalid objects value.');
        }
    } else {
        res.status(400).send('Invalid request: Query should be empty or have only "objects" key.');
    }
}

const isValidImageGetParams = (param: ImagesGetRequestParams) => {
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
    } catch (error: any) {
        console.error('Error parsing query params', error);
        return false;
    }
}
