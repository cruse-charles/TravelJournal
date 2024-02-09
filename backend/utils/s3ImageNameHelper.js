import crypto from 'crypto'

// Provide random name for images to act as key/name in S3 bucket
export const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
