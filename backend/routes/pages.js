import { Router } from 'express'
import { getLoginPage, getIndexPage, getProfilePage, getRegisterPage } from '../controllers/pages.js'
import { authRequired } from '../jwt.js'

const router = Router()

router.get('/login', getLoginPage)
router.get('/register', getRegisterPage)
router.get('/index', authRequired, getIndexPage)
router.get('/profile', authRequired, getProfilePage)

export default router
