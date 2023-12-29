import { Router, Request, Response } from "express";
import { validateImageGetParams } from "../middleware/images.middleware";
import axios from "axios";

const router = Router();
const baseUrl = '/images'

// curl --user "acc_e7549594a6b6924:281626bcd92f3a0b2a3c8d356fd1b52a" https://api.imagga.com/v2/tags?image_url=https://docs.imagga.com/static/images/docs/sample/japan-605234_1280.jpg


router.get(`${baseUrl}/test`, async (req: Request, res: Response): Promise<Response> => {
    const apiKey = process.env.API_KEY || 'defaultKeyValue'
    const apiSecret = process.env.API_SECRET || 'defaultKeyValue'
    const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Labrador_Retriever_portrait.jpg/1200px-Labrador_Retriever_portrait.jpg';
    const url = `https://api.imagga.com/v2/tags?image_url=${encodeURIComponent(imageUrl)}`;
    const authKey = `${apiKey}:${apiSecret}`;
    const base64Auth = Buffer.from(authKey).toString('base64');


    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${base64Auth}`
            }
        });

        return res.json(response.data);
    } catch (error) {
        console.error('Error making the API request', error);
        return res.status(500).send('Error making the API request');
    }
});

router.get(`${baseUrl}`, validateImageGetParams, async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({
        message: "Hello World!",
    });
});

export default router;
