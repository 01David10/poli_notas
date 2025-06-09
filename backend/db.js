import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config() // carga las variables del archivo .env

const uri = process.env.CONNECTION_STRING

async function DatabaseConnection () {
  try {
    await mongoose.connect(uri)
    console.log('Database connected')
  } catch (error) {
    console.log('Database connection error', error)
  }
}

export default DatabaseConnection
