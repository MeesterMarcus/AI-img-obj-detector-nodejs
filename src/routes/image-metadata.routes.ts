import { Router, Request, Response } from "express";
import { validateImageGetParams } from "../middleware/image-request-validator.middleware";
import { Image } from "../schemas/image-metadata";
import ImageService from "../services/image.service";

const router = Router();
const baseUrl = '/images'

router.get(`${baseUrl}`, validateImageGetParams, async (req: Request, res: Response): Promise<Response> => {
    let images
    if (req.query.objects && typeof req.query.objects === 'string') {
        const objects: string = req.query.objects;
        const objectsArr = objects.split(',')
        images = await Image.find({
            'objects': { $in: objectsArr }
        });
    } else {
        images = await Image.find({})
    }
    return res.status(200).send(images);
});

router.post(`${baseUrl}`, async (req: Request, res: Response): Promise<Response> => {
    if (!req.headers.authorization) {
        throw new Error("Missing authorization")
    }
    try {
        const result = await ImageService.createImage(req.body, req.headers.authorization);
        return res.status(200).send({
            message: "Successfully saved image document",
            body: result
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Error processing image');
    }
});

export default router;
