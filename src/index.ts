// app.ts or server.ts

import express, { Application } from "express";
import detectorRouter from './routes/detector.route'; // ensure the path is correct

const app: Application = express();

// Use the routes
app.use('/', detectorRouter);

const PORT = 3000;

try {
    app.listen(PORT, (): void => {
        console.log(`Connected successfully on port ${PORT}`);
    });
} catch (error: any) {
    console.error(`Error occurred: ${error.message}`);
}
