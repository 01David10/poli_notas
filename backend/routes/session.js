import { Router } from 'express'
import { login, register, logout, getLoggedUser, resetPassword } from '../controllers/session.js'

const router = Router()

router.post('/login', login)
router.post('/register', register)
router.post('/logout', logout)
router.get('/loggedUser', getLoggedUser)
router.post('/reset-password', resetPassword)

export default router
