import { Router, Request, Response } from "express";
import { validateImageGetParams } from "../middleware/image-request-validator.middleware";
import { ImageMetadata } from "../schemas/image-metadata";
import ImageService from "../services/image.service";
import { isLocalFile } from "../lib/check-filepath";
import * as fs from 'fs';
import { validateObjectId } from "../middleware/object-id-validator.middleware";

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
    return res.status(200).send(images);
});

/**
 * Retrieve an image by its _id
 */
router.get(`${baseUrl}/:id`, validateObjectId, async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id
    const image = await ImageMetadata.findById(id)
    if (!image) {
        return res.status(404).send({ message: 'Image not found'})
    }
    return res.status(200).send(image);
});

/**
 * Create a new image and persist in DB. If requested, parse image to detect objects and persist.
 */
router.post(`${baseUrl}`, async (req: Request, res: Response): Promise<Response> => {
    if (!req.headers.authorization) {
        return res.status(401).send('Missing authorization header');
    }
    let imgUrl = req.body.imgUrl
    let isUploadedFile = false

    try {
        // check if the file provided by client is a remote url or local
        if (isLocalFile(imgUrl)) {
            if (!fs.existsSync(imgUrl)) {
                return res.status(404).send({ messages: "The file you are attempting to upload does not exist" })
            }
            // if it is a local file, upload it to Imagga and set isUploadFile to true
            isUploadedFile = true
            const response = await ImageService.uploadImage(imgUrl, req.headers.authorization)
            const { data } = response
            imgUrl = data.result.upload_id
        }
        // update the body and create the image
        const updatedBody = { ...req.body, imgUrl}
        const result = await ImageService.createImage(updatedBody, isUploadedFile, req.headers.authorization);
            return res.status(200).send({
                ...result
            });
    }

    catch (error) {
        return res.status(500).send('Error processing image');
    }
});

export default router;
