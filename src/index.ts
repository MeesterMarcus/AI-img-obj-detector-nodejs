import dotenv from 'dotenv';
import mongoose from 'mongoose'
import express, { Application } from "express";
import detectorRouter from './routes/image-metadata.routes';
dotenv.config();

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', detectorRouter);

// Connect Mongoose
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

