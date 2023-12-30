import { Router, Request, Response } from "express";
import { validateImageGetParams } from "../middleware/image-request-validator.middleware";
import { ImageMetadata } from "../schemas/image-metadata";
import ImageService from "../services/image.service";

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
router.get(`${baseUrl}/:id`, async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id
    const image = await ImageMetadata.findById(id)
    return res.status(200).send(image);
});

/**
 * Create a new image and persist in DB. If requested, parse image to detect objects and persist.
 */
router.post(`${baseUrl}`, async (req: Request, res: Response): Promise<Response> => {
    if (!req.headers.authorization) {
        throw new Error("Missing authorization")
    }
    try {
        const result = await ImageService.createImage(req.body, req.headers.authorization);
        return res.status(200).send({
            ...result
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Error processing image');
    }
});

export default router;
