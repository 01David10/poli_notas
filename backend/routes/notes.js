import express from 'express'
import multer from 'multer'
import { uploadFile, getUserNotes } from '../controllers/notes.js'

const router = express.Router()

// configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/upload', upload.single('file'), uploadFile)
router.get('/userNotes', getUserNotes)

export default router
