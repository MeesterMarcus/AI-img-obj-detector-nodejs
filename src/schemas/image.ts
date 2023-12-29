import mongoose from 'mongoose'
import { IImage } from '../models/images.models'

interface imageModelInterface extends mongoose.Model<ImageDoc> {
    build(attr: IImage): ImageDoc
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

imageSchema.statics.build = (attr: IImage) => {
    return new Image(attr)
}

const Image = mongoose.model<ImageDoc, imageModelInterface>('Image', imageSchema)

export { Image }