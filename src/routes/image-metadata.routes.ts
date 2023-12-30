import { Router, Request, Response } from 'express';
import { validateImageGetParams } from '../middleware/image-request-validator.middleware';
import { ImageMetadata } from '../schemas/image-metadata';
import ImageService from '../services/image.service';
import { isLocalFile } from '../lib/check-filepath';
import { validateObjectId } from '../middleware/object-id-validator.middleware';
import { HTTP_STATUS } from '../constants/http-status.constants';
import { IMAGE_NOT_FOUND } from '../constants/messages.constants';
import { checkAuthorization } from '../middleware/auth-check.middleware';
import { handleImageServiceError } from '../lib/handle-error';
import { validateImage } from '../middleware/validate-image.middleware';

const router = Router();
const baseUrl = '/images';

/**
 * Retrieve all images, optionally filtering by objects
 */
router.get(
  `${baseUrl}`,
  validateImageGetParams,
  async (req: Request, res: Response): Promise<Response> => {
    let images;
    if (req.query.objects && typeof req.query.objects === 'string') {
      const objects: string = req.query.objects;
      const objectsArr = objects.split(',');
      images = await ImageMetadata.find({
        objects: { $in: objectsArr },
      });
    } else {
      images = await ImageMetadata.find({});
    }
    return res.status(HTTP_STATUS.OKAY).send(images);
  },
);

/**
 * Retrieve an image by its _id
 */
router.get(
  `${baseUrl}/:id`,
  validateObjectId,
  async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id;
    const image = await ImageMetadata.findById(id);
    if (!image) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send({ message: IMAGE_NOT_FOUND });
    }
    return res.status(HTTP_STATUS.OKAY).send(image);
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
    let imgUrl = req.body.imgUrl;
    let isUploadedFile = false;

    try {
      // check if the file provided by client is a remote url or local
      if (isLocalFile(imgUrl)) {
        isUploadedFile = true;
        imgUrl = await ImageService.handleLocalFile(imgUrl, auth);
      }
      // update the body and create the image
      const updatedBody = { ...req.body, imgUrl };
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
