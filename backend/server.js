import express from 'express'
import cookieParser from 'cookie-parser'

import DatabaseConnection from './db.js'

import userRoutes from '../backend/routes/user.js'
import sessionRoutes from './routes/session.js'
import pagesRoutes from './routes/pages.js'
import notesRoutes from './routes/notes.js'

// start server
const app = express()

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.static('frontend')) // incluir el frontend

// connect to database
DatabaseConnection()

// routes
app.use('/', pagesRoutes)
app.use('/users', userRoutes)
app.use('/session', sessionRoutes)
app.use('/notes', notesRoutes)

// set port
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000/login')
})
