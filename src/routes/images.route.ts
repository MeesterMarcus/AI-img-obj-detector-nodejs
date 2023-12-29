import { Router, Request, Response } from "express";
import { validateImageGetParams } from "../middleware/images.middleware";
import { basicAuth } from "../middleware/auth.middleware"; // Import the middleware
import axios from "axios";

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
    return res.status(200).send({
        message: "Hello World!",
    });
});

export default router;
