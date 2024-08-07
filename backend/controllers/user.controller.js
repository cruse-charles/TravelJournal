import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Entry from '../models/entry.model.js';
import { getImageURLsFromS3 } from '../utils/s3Service.js';

export const updateUser = async (req, res, next) => {
    // Check if user is updating their own data
    if (req.user.id !== req.params.id) return next(errorHandler(403, 'You can only update your own user data'));
    
    try {
        if(req.body.password) {
            // Hash the password before saving it to the database
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        // The MongoDB $set operator replaces the value of a field with the specified value
        // {new: true} option returns the modified document rather than the original
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            }
        }, {new: true});

        // Deconstruct the password field from the updated user document and send the rest of the data
        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    // Check if user is deleting their own data
    if (req.user.id !== req.params.id) return next(errorHandler(403, 'You can only delete your own user data'));
    
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted')
    } catch (error) {
        next(error)
    }
}

export const getUserEntries = async (req, res, next) => {
    // Check if user is viewing their own entrys
    if (req.user.id !== req.params.id) return next(errorHandler(403, 'You can only view your own entries'));
    try {
        // Find all entries created by the user
        const entries = await Entry.find({user: req.params.id})
        
        // Get signed URLs for images from S3 and replace the attachment names with URLs
        for (const entry of entries) {
            const urls = await getImageURLsFromS3(entry.attachments);
            entry.attachments = urls;
        }

        // Send the entrys data with signed URLs
        res.status(200).json(entries);
    } catch (error) {
        next(error)
    }
}