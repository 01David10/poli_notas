import express from 'express'
import multer from 'multer'
import { uploadFile, getUserNotes } from '../controllers/notes.js'
import { getNotesBySubject } from '../controllers/dowloadnotes'

const router = express.Router()

// configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/upload', upload.single('file'), uploadFile)
router.get('/userNotes', getUserNotes)
router.get('/notesBySubject', getNotesBySubject)

export default router
