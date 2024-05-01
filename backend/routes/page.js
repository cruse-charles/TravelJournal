import express from 'express'
import { pageSave, pageView, pageIndex } from '../controllers/page.controller.js'
import multer from 'multer';

import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.get('/page/:id', pageView)
router.get('/page', pageIndex)
router.post('/page', upload.array('attachments', 3), pageSave)

export default router;