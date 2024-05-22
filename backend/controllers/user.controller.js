import bcryptjs from 'bcryptjs';
import User from '../models/user.model';

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(403, 'You can only update your own user data'));
    
    try {
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            }
        }, {new: true});

        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}