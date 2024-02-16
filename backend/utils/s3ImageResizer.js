import sharp from 'sharp';

// Import file buffer to resize before S3 upload
export const resizeImage = async (buffer) => {
    return await sharp(buffer).resize({height: 800, width: 1200, fit: "contain"}).toBuffer();
}