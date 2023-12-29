import { Router, Request, Response } from "express";
import { validateImageGetParams } from "../middleware/images.middleware";
import { basicAuth } from "../middleware/auth.middleware"; // Import the middleware
import axios from "axios";
import { Image } from "../schemas/image";
import { faker } from '@faker-js/faker';

const router = Router();
const baseUrl = '/images'

router.get(`${baseUrl}/test`, basicAuth, async (req: Request, res: Response): Promise<Response> => {
    const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Labrador_Retriever_portrait.jpg/1200px-Labrador_Retriever_portrait.jpg';
    const url = `https://api.imagga.com/v2/tags?image_url=${encodeURIComponent(imageUrl)}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': req.headers.authorization // Use the authorization header set in the middleware
            }
        });

        return res.json(response.data);
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
    const body = req.body
    const imgData = body.imgData
    const label = body.label ? body.label : faker.string.uuid()
    console.log(label)
    const enableObjectDetection = body.enableObjectDetection
    const objects = []
    // TODO: use imagga
    if (enableObjectDetection) {
        objects.push('dog')
    }
    const entity = { imgData, label, objects }
    console.log(entity)
    const image = Image.build(entity)
    const result = await image.save()
    return res.status(200).send({
        message: "Successfully saved image document",
        body: {
            _id: result._id,
            ...entity
        }
    });
});

export default router;
