import express from 'express'
import { updateUser, deleteUser, getUserPages } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/veryifyUser.js';

const router = express.Router();

router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/pages/:id', verifyToken, getUserPages)
// router.get('/pages/:id', getUserPages)
// router.get('/pages/:id', verifyToken, (req, res, next) => {
//     console.log('after verifyToken, before getUserPages')
//     next()
// } ,getUserPages)

export default router