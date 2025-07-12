import { Router } from 'express'
import { getLoginPage, getIndexPage, getProfilePage, getRegisterPage, getApuntesPage, getAdminPage } from '../controllers/pages.js'
import { authRequired, authForAdmin } from '../jwt.js'

const router = Router()

router.get('/login', getLoginPage)
router.get('/register', getRegisterPage)
router.get('/index', authRequired, getIndexPage)
router.get('/profile', authRequired, getProfilePage)
router.get('/apuntes', getApuntesPage)
router.get('/admin', authRequired, authForAdmin, getAdminPage)

export default router
