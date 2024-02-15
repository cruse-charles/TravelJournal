import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

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