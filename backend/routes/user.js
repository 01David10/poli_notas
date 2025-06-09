import { Router } from 'express'
import { getAllUsers, getUserByDni, createUser, updateUser, deleteUser } from '../controllers/user.js'
import { authRequired } from '../jwt.js'

const router = Router()

router.get('/getAllUsers', getAllUsers, authRequired)
router.get('/getUserById/:dni', getUserByDni)
router.post('/createUser', createUser)
router.put('/updateUser/:dni', updateUser)
router.delete('/deleteUser/:dni', deleteUser)

export default router
