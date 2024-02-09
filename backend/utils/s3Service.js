import { randomImageName } from "../utils/s3ImageNameHelper.js";

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();

const s3BucketName = process.env.S3_BUCKET_NAME
const s3BucketRegion = process.env.S3_BUCKET_REGION
const s3AccessKey = process.env.S3_ACCESS_KEY
const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY

const s3 = new S3Client({
    credentials: {
        accessKeyId: s3AccessKey,
        secretAccessKey: s3SecretAccessKey,
    },
    region: s3BucketRegion
})

export const getImagesFromS3 = async (pageAttachments) => {
    const urlPromises = pageAttachments.map(async (attachment) => {
        const getObjectParams = {
            Bucket: s3BucketName,
            Key: attachment
        }
    
        const command = new GetObjectCommand(getObjectParams);
        return getSignedUrl(s3, command, { expiresIn: 3600 });
    })
    return Promise.all(urlPromises);
}
