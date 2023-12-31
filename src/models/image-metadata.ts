/**
 * Image Metadata Models
 */

import { Tags } from "exifreader";

export interface ImagesGetQueryParams {
  objects?: string;
}

export interface ImageMetadataEntity extends ImageMetadata {
  _id: string;
}

export interface ImageMetadata {
  imageSource: string;
  imageProperties: Tags
  label: string;
  objects: Array<string>;
}

export interface ImagePostRequestParams {
  imageSource: string; // remote image url or local file path
  label?: string;
  enableObjectDetection?: boolean;
  dryRun?: boolean;
}
