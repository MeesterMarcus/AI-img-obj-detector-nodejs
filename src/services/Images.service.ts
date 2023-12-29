import { Image } from "../schemas/image";
import { faker } from '@faker-js/faker';

class ImageService {
    static async createImage(body: any) {
        const imgData = body.imgData;
        const label = body.label ? body.label : faker.datatype.uuid();
        const enableObjectDetection = body.enableObjectDetection;
        const objects: string[] = [];

        // TODO: use imagga or other object detection logic here
        if (enableObjectDetection) {
            objects.push('dog'); // This should be replaced with real object detection results
        }

        const entity = { imgData, label, objects };

        const image = Image.build(entity);
        const result = await image.save();

        return {
            _id: result._id,
            ...entity
        };
    }
}

export default ImageService;