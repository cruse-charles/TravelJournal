import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({username, email, password: hashedPassword});
    await newUser.save()
        .then(() => {
        res.status(201).json('User created');
        })
        .catch((error) => {
            next(error);
        });
};