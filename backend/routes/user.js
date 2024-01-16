import express from 'express'
import { updateUser, deleteUser, getUserPages } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/veryifyUser.js';

const router = express.Router();

router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserPages)

export default router