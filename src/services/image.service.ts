import axios, { AxiosResponse } from 'axios';
import { ImageMetadata } from '../schemas/image-metadata';
import { faker } from '@faker-js/faker';
import { ImageMetadataEntity, ImagePostRequestParams } from '../models/image-metadata';
import FormData from 'form-data';
import * as fs from 'fs';
import { extractHighConfidenceTags } from '../lib/extract-tags';

/**
 * Singleton ImageService that provides operations on image data
 */
class ImageService {
  /**
   * Create an image and add to the database, applying object detection if requested
   * @param body
   * @param authorizationHeader
   * @returns
   */
  static async createImage(
    body: ImagePostRequestParams,
    isUploadedFile: boolean,
    authorizationHeader: string,
  ): Promise<ImageMetadataEntity> {
    const imgUrl = body.imgUrl;
    const label = body.label ? body.label : faker.string.uuid();
    const enableObjectDetection = body.enableObjectDetection;
    let objects: string[] = [];

    if (enableObjectDetection) {
      objects = await this.parseImage(imgUrl, isUploadedFile, authorizationHeader);
    }

    const entity = { imgUrl, label, objects };

    const image = ImageMetadata.build(entity);

    let result;
    // if dryRun enabled, do not persist data
    if (!body.dryRun) {
      result = await image.save();
    }

    return {
      _id: result?._id,
      ...entity,
    };
  }

  /**
   * Use Imagga API to parse a passed in image url and determine the objects that are within the image.
   * @param imageUrl
   * @param authorizationHeader
   * @returns Promise<string[]>
   */
  static async parseImage(imageUrl: string, isUploadedFile: boolean, authorizationHeader: string): Promise<string[]> {
    let url;
    if (isUploadedFile) {
      url = `https://api.imagga.com/v2/tags?image_upload_id=${encodeURIComponent(imageUrl)}`;
    } else {
      url = `https://api.imagga.com/v2/tags?image_url=${encodeURIComponent(imageUrl)}`;
    }
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: authorizationHeader,
        },
      });
      return extractHighConfidenceTags(response.data);
    } catch (error) {
      // Rethrow the error or create a custom error as needed
      throw error;
    }
  }

  /**
   * Upload an image using Imagga's built-in uploading feature, and return the response which contains
   * the upload_id. This upload_id can be used to parse an image.
   * @param filePath : string
   * @param authorizationHeader : string
   * @returns Promise<AxiosResponse>
   */
  static async uploadImage(filePath: string, authorizationHeader: string): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));
    const url = 'https://api.imagga.com/v2/uploads';

    try {
      return await axios.post(url, formData, {
        headers: {
          Authorization: authorizationHeader,
        },
      });
    } catch (error) {
      // Rethrow the error or create a custom error as needed
      throw error;
    }
  }
}

export default ImageService;
