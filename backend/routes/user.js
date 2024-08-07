import express from 'express'
import { updateUser, deleteUser, getUserEntries } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/veryifyUser.js';

const router = express.Router();

router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/entries/:id', verifyToken, getUserEntries)

export default router