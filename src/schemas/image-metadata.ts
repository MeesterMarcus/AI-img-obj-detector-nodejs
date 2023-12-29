import mongoose from 'mongoose'
import { ImageMetadata } from '../models/image-metadata'

interface imageModelInterface extends mongoose.Model<ImageDoc> {
    build(attr: ImageMetadata): ImageDoc
}

interface ImageDoc extends mongoose.Document {
    imgData: string;
    label: string;
    objects: Array<string>;
}

const imageSchema = new mongoose.Schema({
    imgData: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    objects: {
        type: Array,
        required: false
    }
})

imageSchema.index({ objects: 1})

imageSchema.statics.build = (attr: ImageMetadata) => {
    return new Image(attr)
}

const Image = mongoose.model<ImageDoc, imageModelInterface>('Image', imageSchema)

export { Image }