import { CONFIDENCE_THRESHOLD } from '../constants/tags.constants';
import { ImaggaResponse, Tag } from '../models/imagga';

/**
 * Retrieve the objects inside the image with a confidence > CONFIDENCE_THRESHOLD
 * @param response : ImaggaResponse
 * @returns : string[]
 */
export const extractHighConfidenceTags = (response: ImaggaResponse): string[] => {
  const tags = response.result.tags;

  return tags.filter((tag: Tag) => tag.confidence >= CONFIDENCE_THRESHOLD).map((tag: Tag) => tag.tag.en);
};
