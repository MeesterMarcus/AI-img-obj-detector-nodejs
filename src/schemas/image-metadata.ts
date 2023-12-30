import mongoose from 'mongoose';
import { ImageMetadata } from '../models/image-metadata';

/**
 * Workaround to enforce TypeScript typings with regards to Mongoose / MongoDB.
 */

interface imageModelInterface extends mongoose.Model<ImageMetadataDoc> {
  build(attr: ImageMetadata): ImageMetadataDoc;
}

interface ImageMetadataDoc extends mongoose.Document {
  imgUrl: string;
  label: string;
  objects: Array<string>;
}

const imageMetadataSchema = new mongoose.Schema({
  imgUrl: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  objects: {
    type: Array,
    required: false,
  },
});

imageMetadataSchema.index({ objects: 1 });

imageMetadataSchema.statics.build = (attr: ImageMetadata) => {
  return new ImageMetadata(attr);
};

const ImageMetadata = mongoose.model<ImageMetadataDoc, imageModelInterface>('Image', imageMetadataSchema);

export { ImageMetadata };
