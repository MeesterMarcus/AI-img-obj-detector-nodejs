import { Router, Request, Response } from "express";
import { validateImageGetParams } from "../middleware/images.middleware";

const router = Router();
const baseUrl = '/images'

router.get(`${baseUrl}`, validateImageGetParams, async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({
        message: "Hello World!",
    });
});

export default router;
