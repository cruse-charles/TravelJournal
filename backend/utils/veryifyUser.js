import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Extract the access token from the cookies sent in the request
    const token = req.cookies.access_token;
    console.log('inside verifyToken')

    if (!token) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    // Verify the token using the secret key
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return next(errorHandler(401, 'Unauthorized'));
        }

        // If the token is valid, attach the user payload to the request object
        console.log(user)
        req.user = user;
        console.log('inside verifyToken jwtfVerify')
        console.log(req.user)
        next();
    });
    console.log('End of verifyToken')
}