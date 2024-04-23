import { getImageURLsFromS3, saveImagesToS3, deleteImagesFromS3 } from "../utils/s3Service.js";
import { errorHandler } from "../utils/error.js";

import Entry from "../models/entry.model.js";


export const entryView = async (req, res, next) => {
    try {
        // find entry by ID or return 404
        const entry = await Entry.findById(req.params.id);
        if (!entry) {
            return res.status(404).json('Entry not found');
        }

        // Check if current user is the owner of the entry
        if (req.user.id !== entry.user.toString()) {
            return next(errorHandler(403, 'You can only view your own entries'))
        }

        // get signed URLs for images
        const urls = await getImageURLsFromS3(entry.attachments)

        // return entry data with signed URLs
        res.status(200).json({...entry._doc, attachments: urls});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const entryIndex = async (req, res) => {
    res.send({message: 'Index entry'});
}

export const entrySave = async (req, res, next) => {
    const {title, text, date, user} = req.body;

    // check if user exists
    if (user == "null") {
        return next(errorHandler(404, 'Must be logged in to create an entry'));
    }

    // save images to S3 and get image names
    const attachments = await saveImagesToS3(req.files);

    // save entry data to MongoDB with image names
    const newEntry = new Entry({title, text, attachments, date, user});
    await newEntry.save()
        .then((savedEntry) => {
            res.status(201).json(savedEntry._id);
        })
        .catch((error) => {
            res.status(400).json({message: error.message});
        });
}

export const entryDelete = async (req, res, next) => {
    try {
        const entry = await Entry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json('Entry not found');
        }

        if (req.user.id !== entry.user.toString()) {
            return next(errorHandler(403, 'You can only delete your own entries'))
        }

        // delete images from S3
        await deleteImagesFromS3(entry.attachments);

        // delete entry from MongoDB
        await Entry.findByIdAndDelete(req.params.id);
        res.status(200).json('Entry deleted');
    } catch (error) {
        console.log(error)
    }
}

export const entryUpdate = async (req, res, next) => {
    try {
        const entry = await Entry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json('Entry not found')
        }

        if (req.user.id !== entry.user.toString()) {
            return next(errorHandler(403, 'You can only update your own entries'))
        }
        
        // Delete current entry images from S3 and save new images
        await deleteImagesFromS3(entry.attachments);
        const attachments = await saveImagesToS3(req.files);

        const updatedEntryData = {
            ...req.body,
            attachments
        }

        const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, updatedEntryData, {new: true});

        // get signed URLs for images
        const urls = await getImageURLsFromS3(updatedEntryData.attachments)

        // return entry data with signed URLs
        res.status(200).json({...updatedEntry._doc, attachments: urls});

    } catch (error) {
        console.log(error)
    }
}