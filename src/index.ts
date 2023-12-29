// app.ts or server.ts
import dotenv from 'dotenv';
import mongoose from 'mongoose'

dotenv.config();

import express, { Application } from "express";
import detectorRouter from './routes/images.route'; // ensure the path is correct

const app: Application = express();

// Use the routes
app.use('/', detectorRouter);

// Connect mongoose
async function connectToDatabase() {
    const dbUri = process.env.MONGO_DB_CONNECTION_STRING || 'defaultKey';
    
    try {
        await mongoose.connect(dbUri);
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database', error);
    }
}

connectToDatabase();

// Start server
const PORT = 3000;

try {
    app.listen(PORT, (): void => {
        console.log(`Connected successfully on port ${PORT}`);
    });
} catch (error: unknown) {
    console.error(`Error occurred: ${error}`);
}

