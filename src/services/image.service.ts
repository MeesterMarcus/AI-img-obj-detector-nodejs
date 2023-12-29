import axios from "axios";
import { Image } from "../schemas/image-metadata";
import { faker } from '@faker-js/faker';
import { ImaggaResponse, Tag } from "../models/imagga";
import { ImagePostRequestParams } from "../models/image-metadata";

class ImageService {
    static async createImage(body: ImagePostRequestParams, authorizationHeader: string) {
        const imgData = body.imgData;
        const label = body.label ? body.label : faker.datatype.uuid();
        const enableObjectDetection = body.enableObjectDetection;
        let objects: string[] = [];

        if (enableObjectDetection) {
            objects = await this.parseImage(imgData, authorizationHeader)
        }

        const entity = { imgData, label, objects };

        const image = Image.build(entity);
        
        let result
        if(!body.dryRun) {
            result = await image.save();
        }

        return {
            _id: result?._id,
            ...entity
        };
    }

    static async parseImage(imageUrl: string, authorizationHeader: string) {
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