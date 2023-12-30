import { Router, Request, Response } from "express";
import { validateImageGetParams } from "../middleware/image-request-validator.middleware";
import { ImageMetadata } from "../schemas/image-metadata";
import ImageService from "../services/image.service";
import { isLocalFile } from "../lib/check-filepath";
import { validateObjectId } from "../middleware/object-id-validator.middleware";
import { HTTP_STATUS } from "../constants/http-status.constants";
import { FILE_NOT_FOUND, IMAGE_NOT_FOUND, IMAGE_PROCESSING_FAILED, MISSING_AUTH } from "../constants/response-messages.constants";
import * as fs from 'fs';

const router = Router();
const baseUrl = '/images'

/**
 * Retrieve all images, optionally filtering by objects
 */
router.get(`${baseUrl}`, validateImageGetParams, async (req: Request, res: Response): Promise<Response> => {
    let images
    if (req.query.objects && typeof req.query.objects === 'string') {
        const objects: string = req.query.objects;
        const objectsArr = objects.split(',')
        images = await ImageMetadata.find({
            'objects': { $in: objectsArr }
        });
    } else {
        images = await ImageMetadata.find({})
    }
    return res.status(HTTP_STATUS.OKAY).send(images);
});

/**
 * Retrieve an image by its _id
 */
router.get(`${baseUrl}/:id`, validateObjectId, async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id
    const image = await ImageMetadata.findById(id)
    if (!image) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: IMAGE_NOT_FOUND })
    }
    return res.status(HTTP_STATUS.OKAY).send(image);
});

/**
 * Create a new image and persist in DB. If requested, parse image to detect objects and persist.
 */
router.post(`${baseUrl}`, async (req: Request, res: Response): Promise<Response> => {
    if (!req.headers.authorization) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send(MISSING_AUTH);
    }
    let imgUrl = req.body.imgUrl
    let isUploadedFile = false

    try {
        // check if the file provided by client is a remote url or local
        if (isLocalFile(imgUrl)) {
            if (!fs.existsSync(imgUrl)) {
                return res.status(404).send({ messages: FILE_NOT_FOUND })
            }
            // if it is a local file, upload it to Imagga and set isUploadFile to true
            isUploadedFile = true
            const response = await ImageService.uploadImage(imgUrl, req.headers.authorization)
            const { data } = response
            imgUrl = data.result.upload_id
        }
        // update the body and create the image
        const updatedBody = { ...req.body, imgUrl }
        const result = await ImageService.createImage(updatedBody, isUploadedFile, req.headers.authorization);
        return res.status(HTTP_STATUS.OKAY).send({
            ...result
        });
    }

    catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(IMAGE_PROCESSING_FAILED);
    }
});

export default router;
