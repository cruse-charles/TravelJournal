import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
        return next(errorHandler(400, 'All fields are required'));
    }

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

export const login = async (req, res, next) => {
    const {email, password} = req.body;

    try {
        if (!email || !password) return next(errorHandler(400, 'All fields are required'));

        const user = await User.findOne({email});
        if (!user) return next(errorHandler(404, 'Invalid credentials'));

        const isPasswordValid = bcryptjs.compareSync(password, user.password);
        if (!isPasswordValid) return next(errorHandler(401, 'Invalid credentials'));
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        
        const {password: pass, ...userWithoutPassword} = user._doc;

        res.cookie('access_token', token, {httpOnly: true}).status(200).json(userWithoutPassword);
    } catch (error) {
        next(error);
    }
};