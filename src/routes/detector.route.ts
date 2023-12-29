// home.route.ts

import { Router, Request, Response } from "express";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({
        message: "Hello World!",
    });
});

export default router;
