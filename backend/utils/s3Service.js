import { randomImageName } from "./s3ImageNameHelper.js";
import { resizeImage } from "./s3ImageResizer.js";

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import dotenv from 'dotenv';
dotenv.config();

const s3BucketName = process.env.S3_BUCKET_NAME
const s3BucketRegion = process.env.S3_BUCKET_REGION
const s3AccessKey = process.env.S3_ACCESS_KEY
const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY

// Create a new S3 client
const s3 = new S3Client({
    credentials: {
        accessKeyId: s3AccessKey,
        secretAccessKey: s3SecretAccessKey,
    },
    region: s3BucketRegion
})

// Get signed URLs for images in S3 for a entry
export const getImageURLsFromS3 = async (entryAttachments) => {

    // Create an array of signed URLs for each image
    const urlPromises = entryAttachments.map(async (attachment) => {
        const getObjectParams = {
            Bucket: s3BucketName,
            Key: attachment
        }
    
        const command = new GetObjectCommand(getObjectParams);
        return getSignedUrl(s3, command, { expiresIn: 3600 });
    })
    // await all signed URL promises
    return Promise.all(urlPromises);
}

// Save images to S3 bucket and return image names
export const saveImagesToS3 = async (files) => {
    const attachments = [];

    // Resize each image and give random name and upload to S3
    const uploadPromises = files.map(async (file) => {
        console.log(file)
        const buffer = await resizeImage(file.buffer);
        const imageName = randomImageName();
        attachments.push(imageName);
        // attachments.push(file.originalname)

        const params = {
            Bucket: s3BucketName,
            Key: imageName,
            // Key: file.originalname,
            Body: buffer,
            ContentType: file.mimetype
        };

        const command = new PutObjectCommand(params);
        return s3.send(command);
    });

    // await all image upload promises and return array of image names
    await Promise.all(uploadPromises);
    return attachments;
}