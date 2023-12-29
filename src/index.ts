// app.ts or server.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from "express";
import detectorRouter from './routes/images.route'; // ensure the path is correct

const app: Application = express();

// Use the routes
app.use('/', detectorRouter);

const PORT = 3000;

try {
    app.listen(PORT, (): void => {
        console.log(`Connected successfully on port ${PORT}`);
    });
} catch (error: unknown) {
    console.error(`Error occurred: ${error}`);
}

