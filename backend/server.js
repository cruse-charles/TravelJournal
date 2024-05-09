import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import pageRouter from './routes/page.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// for parsing application/json from req.body
app.use(express.json()); 

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log(error);
});


app.listen(PORT, () => {
    // connectToMongoDB();
    console.log(`Server is running on port ${PORT}`)
})

app.use('/api/page', pageRouter);
app.use('/api/auth', authRouter);

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    return res.status(statusCode).json({statusCode, message});
})