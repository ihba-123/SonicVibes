import { Router } from 'express'
import { adminCheck, signIn,  signUp } from '../controller/userManual.controller.js'
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/signin',signIn)
router.post('/signup',signUp)
router.get('/adminCheck',protectRoute,requireAdmin, adminCheck)

export default router