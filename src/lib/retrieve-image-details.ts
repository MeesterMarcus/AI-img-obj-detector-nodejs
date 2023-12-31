import ExifReader, { Tags } from 'exifreader';

export const getImageProperties = async (imagePath: string): Promise<Tags> => {
    const tags = await ExifReader.load(imagePath);
    return tags
}