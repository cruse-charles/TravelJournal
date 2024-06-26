import express from 'express'
import { pageSave, pageView, pageIndex } from '../controllers/page.controller.js'
import multer from 'multer';
import { verifyToken } from '../utils/veryifyUser.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.get('/:id', verifyToken, pageView)
router.get('/', pageIndex)
router.post('/', upload.array('attachments', 3), pageSave)

export default router;