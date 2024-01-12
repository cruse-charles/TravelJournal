import { getImageURLsFromS3, saveImagesToS3 } from "../utils/s3Service.js";

import Page from "../models/page.model.js";


export const pageView = async (req, res) => {
    try {
        // find page by ID or return 404
        const page = await Page.findById(req.params.id);
        if (!page) {
            return res.status(404).json('Page not found');
        }

        // get signed URLs for images
        const urls = await getImageURLsFromS3(page.attachments)

        // return page data with signed URLs
        res.status(200).json({...page._doc, attachments: urls});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const pageIndex = async (req, res) => {
    res.send({message: 'Index page'});
}

export const pageSave = async (req, res) => {
    const {title, text, date} = req.body;

    // save images to S3 and get image names
    const attachments = await saveImagesToS3(req.files);

    // save page data to MongoDB with image names
    const newPage = new Page({title, text, attachments, date});
    await newPage.save()
        .then(() => {
            res.status(201).json('Page created');
        })
        .catch((error) => {
            res.status(400).json({message: error.message});
        });
}