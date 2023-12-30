import axios from "axios";
import { ImageMetadata } from "../schemas/image-metadata";
import { faker } from '@faker-js/faker';
import { ImaggaResponse, Tag } from "../models/imagga";
import { ImageMetadataEntity, ImagePostRequestParams } from "../models/image-metadata";

class ImageService {
    /**
     * Create an image and add to the database, applying object detection if requested
     * @param body 
     * @param authorizationHeader 
     * @returns 
     */
    static async createImage(body: ImagePostRequestParams, authorizationHeader: string): Promise<ImageMetadataEntity> {
        const imgUrl = body.imgUrl;
        const label = body.label ? body.label : faker.string.uuid();
        const enableObjectDetection = body.enableObjectDetection;
        let objects: string[] = [];

        if (enableObjectDetection) {
            objects = await this.parseImage(imgUrl, authorizationHeader)
        }

        const entity = { imgUrl, label, objects };

        const image = ImageMetadata.build(entity);
        
        let result
        // if dryRun enabled, do not persist data
        if(!body.dryRun) {
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
    static async parseImage(imageUrl: string, authorizationHeader: string): Promise<string[]> {
        const url = `https://api.imagga.com/v2/tags?image_url=${encodeURIComponent(imageUrl)}`;
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