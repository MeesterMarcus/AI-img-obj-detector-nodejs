import { ImaggaResponse, Tag } from "../models/imagga";

const CONFIDENCE_THRESHOLD = 75

/**
 * Retrieve the objects inside the image with a confidence > 70
 * @param response : ImaggaResponse
 * @returns : string[]
 */
export const extractHighConfidenceTags = (response: ImaggaResponse): string[] => {
    const tags = response.result.tags;

    return tags
        .filter((tag: Tag) => tag.confidence > CONFIDENCE_THRESHOLD) 
        .map((tag: Tag) => tag.tag.en);
}