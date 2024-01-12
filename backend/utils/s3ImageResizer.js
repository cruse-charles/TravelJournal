import sharp from 'sharp';

// Import file buffer to resize before S3 upload
export const resizeImage = async (buffer) => {
    return await sharp(buffer).resize({height: 1920, width: 1080, fit: "contain"}).toBuffer();
}