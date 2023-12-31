import mongoose from 'mongoose';
import { ImageMetadata } from '../models/image-metadata';
import { Tags } from 'exifreader';

/**
 * Workaround to enforce TypeScript typings with regards to Mongoose / MongoDB.
 */

interface imageModelInterface extends mongoose.Model<ImageMetadataDoc> {
  build(attr: ImageMetadata): ImageMetadataDoc;
}

interface ImageMetadataDoc extends mongoose.Document {
  imageSource: string;
  imageProperties: Tags
  label: string;
  objects: Array<string>;
}

const imageMetadataSchema = new mongoose.Schema({
  imageSource: {
    type: String,
    required: true,
  },
  imageProperties: {
    type: Object,
    required: true
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

const ImageMetadata = mongoose.model<ImageMetadataDoc, imageModelInterface>(
  'Image',
  imageMetadataSchema,
);

export { ImageMetadata };
