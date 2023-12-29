import { Router, Request, Response } from "express";
import { validateImageGetParams } from "../middleware/images.middleware";
import { Image } from "../schemas/image";
import ImageService from "../services/Images.service";

const router = Router();
const baseUrl = '/images'

router.get(`${baseUrl}/test`, async (req: Request, res: Response): Promise<Response> => {
    const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Labrador_Retriever_portrait.jpg/1200px-Labrador_Retriever_portrait.jpg';
    if (!req.headers.authorization) {
        throw new Error("Missing authorization")
    }
    try {
        const response = await ImageService.parseImage(imageUrl, req.headers.authorization);
        return res.json(response);
    } catch (error) {
        console.error('Error making the API request', error);
        return res.status(500).send('Error making the API request');
    }
});

router.get(`${baseUrl}`, validateImageGetParams, async (req: Request, res: Response): Promise<Response> => {
    const images = Image.find({})
    console.log(images)
    return res.status(200).send({
        message: "Hello World!",
    });
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
