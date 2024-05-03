import express from 'express'
import { pageSave, pageView, pageIndex } from '../controllers/page.controller.js'

const router = express.Router();

router.get('/page/:id', pageView)
router.get('/page', pageIndex)
router.post('/page', pageSave)

export default router;