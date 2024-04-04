import Page from "../models/page.model.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from 'crypto';
import sharp from 'sharp';

import dotenv from 'dotenv';

dotenv.config();

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

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

export const pageView = async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);
        if (!page) {
            return res.status(404).json('Page not found');
        }
        res.status(200).json(page);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const pageIndex = async (req, res) => {
    res.send({message: 'Index page'});
}

export const pageSave = async (req, res) => {
    const {title, text, attachments, date, link} = req.body;
    const newPage = new Page({title, text, attachments, date, link});
    console.log('req.files', req.files)
    console.log('req.body', req.body);

    
    const uploadPromises = req.files.map(async (file) => {
        const buffer = await sharp(file.buffer).resize({height: 1920, width: 1080, fit: "contain"}).toBuffer()
        
        const params = {
            Bucket: s3BucketName,
            Key: randomImageName(),
            Body: buffer,
            ContentType: file.mimetype
        };
    
        const command = new PutObjectCommand(params);
        return s3.send(command);
    });
    
    await Promise.all(uploadPromises);


    await newPage.save()
        .then(() => {
            res.status(201).json('Page created');
        })
        .catch((error) => {
            res.status(400).json({message: error.message});
        });
}