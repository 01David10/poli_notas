import dotenv from 'dotenv'
import { BlobServiceClient } from '@azure/storage-blob'
import { NoteModel } from '../schema.js'
import jwt from 'jsonwebtoken'

dotenv.config()

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'There are no files upload' })
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    )
    const containerClient = blobServiceClient.getContainerClient('apuntes')

    const originalName = req.file.originalname
    const blobName = Date.now() + '-' + originalName
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    await blockBlobClient.uploadData(req.file.buffer)
    const fileUrl = blockBlobClient.url

    const token = req.cookies.token
    if (!token) return res.status(401).json({ error: 'No token found' })

    const tokenSecret = process.env.TOKEN_SECRET
    let user
    try {
      user = jwt.verify(token, tokenSecret)
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    if (!user || !user._id) {
      return res.status(400).json({ error: 'Invalid user data in token' })
    }

    const newNote = new NoteModel({
      userId: user._id,
      title: req.body.title,
      URL: fileUrl,
      subject: req.body.subject
    })

    await newNote.save()

    res.status(200).json({
      message: 'File uploaded successfully',
      url: fileUrl
    })
  } catch (error) {
    console.error('There was an error uploading the file:', error.message)
    res.status(500).json({ error: 'The file did not upload' })
  }
}

const getUserNotes = async (req, res) => {
  try {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ error: 'No token provided' })

    const tokenSecret = process.env.TOKEN_SECRET
    let user
    try {
      user = jwt.verify(token, tokenSecret)
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    if (!user || !user || !user._id) {
      return res.status(400).json({ error: 'Invalid user data in token' })
    }

    const notes = await NoteModel.find({ userId: user._id })

    res.status(200).json(notes)
  } catch (error) {
    console.error('Error fetching user notes:', error.message)
    res.status(500).json({ error: 'Could not fetch user notes' })
  }
}

export { uploadFile, getUserNotes }
