import axios, { AxiosResponse } from "axios";
import { ImageMetadata } from "../schemas/image-metadata";
import { faker } from '@faker-js/faker';
import { ImaggaResponse, Tag, UploadResponse } from "../models/imagga";
import { ImageMetadataEntity, ImagePostRequestParams } from "../models/image-metadata";
import FormData from "form-data";
import * as fs from 'fs';
import { Response } from "express";

class ImageService {
    /**
     * Create an image and add to the database, applying object detection if requested
     * @param body 
     * @param authorizationHeader 
     * @returns 
     */
    static async createImage(body: ImagePostRequestParams, isUploadedFile: boolean, authorizationHeader: string): Promise<ImageMetadataEntity> {
        const imgUrl = body.imgUrl;
        const label = body.label ? body.label : faker.string.uuid();
        const enableObjectDetection = body.enableObjectDetection;
        let objects: string[] = [];

        if (enableObjectDetection) {
            objects = await this.parseImage(imgUrl, isUploadedFile, authorizationHeader)
        }

        const entity = { imgUrl, label, objects };

        const image = ImageMetadata.build(entity);

        let result
        // if dryRun enabled, do not persist data
        if (!body.dryRun) {
            result = await image.save();
        }

        return {
            _id: result?._id,
            ...entity
        };
    }

    /**
     * Use Imagga API to parse a passed in image url and determine the objects that are within the image.
     * @param imageUrl 
     * @param authorizationHeader 
     * @returns Promise<string[]>
     */
    static async parseImage(imageUrl: string, isUploadedFile: boolean, authorizationHeader: string): Promise<string[]> {
        let url
        if (isUploadedFile) {
            url = `https://api.imagga.com/v2/tags?image_upload_id=${encodeURIComponent(imageUrl)}`
        } else {
            url = `https://api.imagga.com/v2/tags?image_url=${encodeURIComponent(imageUrl)}`;
        }
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': authorizationHeader
                }
            });
            return ImageService.extractHighConfidenceTags(response.data);
        } catch (error) {
            // Rethrow the error or create a custom error as needed
            throw error;
        }
    }

    static async uploadImage(filePath: string, authorizationHeader: string): Promise<AxiosResponse> {
        const formData = new FormData();
        formData.append('image', fs.createReadStream(filePath));
        const url = 'https://api.imagga.com/v2/uploads'

        try {
            return await axios.post(url, formData, {
                headers: {
                    'Authorization': authorizationHeader
                }
            });
        } catch (error) {
            // Rethrow the error or create a custom error as needed
            throw error;
        }
    }

    /**
     * Filter the response to only include tags with high levels of confidence, and remap the object array
     * to an array of strings representing the types of objects.
     * @param response : ImaggaResponse
     * @returns string[]
     */
    private static extractHighConfidenceTags(response: ImaggaResponse): string[] {
        // Accessing the tags array
        const tags = response.result.tags;

        // Filtering and mapping
        return tags
            .filter((tag: Tag) => tag.confidence > 70) // Filter tags with confidence > 70
            .map((tag: Tag) => tag.tag.en); // Map over the filtered tags to extract the 'en' value
    }
}

export default ImageService;


// const got = require('got'); // if you don't have "got" - install it with "npm install got"
// const fs = require('fs');
// const FormData = require('form-data');

// const apiKey = '&lt;replace-with-your-api-key&gt;';
// const apiSecret = '&lt;replace-with-your-api-secret&gt;';

// const filePath = '/path/to/image.jpg';
// const formData = new FormData();
// formData.append('image', fs.createReadStream(filePath));

// (async () => {
//     try {
//         const response = await got.post('https://api.imagga.com/v2/uploads', {body: formData, username: apiKey, password: apiSecret});
//         console.log(response.body);
//     } catch (error) {
//         console.log(error.response.body);
//     }
// })();