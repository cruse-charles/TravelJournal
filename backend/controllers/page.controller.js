// import { randomImageName } from "../utils/s3ImageNameHelper.js";
import { getImagesFromS3, saveImagesToS3 } from "../utils/s3Service.js";

import Page from "../models/page.model.js";

// import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import crypto from 'crypto';
// import sharp from 'sharp';

// import dotenv from 'dotenv';

// dotenv.config();

// const s3BucketName = process.env.S3_BUCKET_NAME
// const s3BucketRegion = process.env.S3_BUCKET_REGION
// const s3AccessKey = process.env.S3_ACCESS_KEY
// const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY

// const s3 = new S3Client({
//     credentials: {
//         accessKeyId: s3AccessKey,
//         secretAccessKey: s3SecretAccessKey,
//     },
//     region: s3BucketRegion
// })

export const pageView = async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);
        if (!page) {
            return res.status(404).json('Page not found');
        }

        const urls = await getImagesFromS3(page.attachments)
        console.log(urls)
        // const urlPromises = page.attachments.map(async (attachment) => {
        //     const getObjectParams = {
        //         Bucket: s3BucketName,
        //         Key: attachment
        //     }
    
        //     const command = new GetObjectCommand(getObjectParams);
        //     return getSignedUrl(s3, command, { expiresIn: 3600 });
        // })

        // const urls = await Promise.all(urlPromises);

        res.status(200).json({...page._doc, attachments: urls});
        // res.status(200).json(page)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const pageIndex = async (req, res) => {
    res.send({message: 'Index page'});
}

export const pageSave = async (req, res) => {
    const {title, text, date} = req.body;
    // const attachments = [];
    console.log('req.files', req.files)
    console.log('req.body', req.body);

    const attachments = await saveImagesToS3(req.files);

    const newPage = new Page({title, text, attachments, date});
    await newPage.save()
        .then(() => {
            res.status(201).json('Page created');
        })
        .catch((error) => {
            res.status(400).json({message: error.message});
        });
}