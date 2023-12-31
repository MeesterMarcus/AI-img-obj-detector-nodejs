import { Router, Request, Response } from 'express';
import { validateImageGetParams } from '../middleware/image-request-validator.middleware';
import ImageService from '../services/image.service';
import { isLocalFile } from '../lib/check-filepath';
import { validateObjectId } from '../middleware/object-id-validator.middleware';
import { HTTP_STATUS } from '../constants/http-status.constants';
import { IMAGE_NOT_FOUND } from '../constants/messages.constants';
import { checkAuthorization } from '../middleware/auth-check.middleware';
import { handleImageServiceError } from '../lib/handle-error';
import { validateImage } from '../middleware/validate-image.middleware';
import { parseQueryObjects } from '../lib/parse-query';

const router = Router();
const baseUrl = '/images';

/**
 * Retrieve all images, optionally filtering by objects
 */
router.get(
  `${baseUrl}`,
  validateImageGetParams,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const objectsArr = parseQueryObjects(req);
      const images = await ImageService.getImagesByObjects(objectsArr);
      return res.status(HTTP_STATUS.OKAY).send(images);
    } catch (error) {
      return handleImageServiceError(error as Error, res);
    }
  },
);

/**
 * Retrieve an image by its _id
 */
router.get(
  `${baseUrl}/:id`,
  validateObjectId,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const image = await ImageService.getImageById(id);

      if (!image) {
        throw Error(IMAGE_NOT_FOUND);
      }

      return res.status(HTTP_STATUS.OKAY).send(image);
    } catch (error) {
      return handleImageServiceError(error as Error, res);
    }
  },
);

/**
 * Create a new image and persist in DB. If requested,
 * parse image to detect objects and persist.
 */
router.post(
  `${baseUrl}`,
  checkAuthorization,
  validateImage,
  async (req: Request, res: Response): Promise<Response> => {
    const auth = req.headers.authorization as string;
    let { imageSource } = req.body;
    let isUploadedFile = false;

    try {
      // check if the file provided by client is a remote url or local
      if (isLocalFile(imageSource)) {
        isUploadedFile = true;
        imageSource = await ImageService.handleLocalFile(imageSource, auth);
      }
      // update the body and create the image
      const updatedBody = { ...req.body, imageSource };
      const result = await ImageService.createImage(
        updatedBody,
        isUploadedFile,
        auth,
      );
      return res.status(HTTP_STATUS.OKAY).send({
        ...result,
      });
    } catch (error) {
      return handleImageServiceError(error as Error, res);
    }
  },
);

export default router;
