import express from 'express'
import { entrySave, entryView, entryIndex, entryDelete } from '../controllers/entry.controller.js'
import multer from 'multer';
import { verifyToken } from '../utils/veryifyUser.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.get('/:id', verifyToken, entryView)
router.get('/', entryIndex)
router.post('/', upload.array('attachments', 3), entrySave)
router.delete('/:id', verifyToken, entryDelete)

export default router;