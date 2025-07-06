import dotenv from 'dotenv'
import { NoteModel } from '../schema.js' // Asegúrate de que UserModel se importe correctamente desde schema.js

dotenv.config()

const getNotesBySubject = async (req, res) => {
  try {
    const { subject } = req.query

    if (!subject) {
      return res.status(400).json({ error: 'El parámetro "subject" es requerido' })
    }

    const notes = await NoteModel.find({ subject })
      .populate({ path: 'userId', select: 'name' })
      .lean()

    const formattedNotes = notes.map(note => ({
      title: note.title,
      _URL: note.URL,
      uploaderName: note.userId ? note.userId.name : 'Desconocido',
      date: note.date ? new Date(note.date).toLocaleDateString('es-ES') : 'Sin fecha'
    }))

    res.status(200).json(formattedNotes)
  } catch (error) {
    console.error('Error al obtener los apuntes por materia:', error.message)
    res.status(500).json({ error: 'No se pudieron obtener los apuntes para la materia especificada' })
  }
}

export { getNotesBySubject }
