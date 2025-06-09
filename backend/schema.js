import mongoose from 'mongoose'

const userSchema = {
  name: { type: String, required: true },
  dni: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], required: true }
}

const UserModel = mongoose.model('users', userSchema)

const noteSchema = {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  title: { type: String, required: true },
  URL: { type: String, required: true },
  rating: { type: [{ type: Number, min: 1, max: 5 }], default: [] },
  subject: { type: String, required: true },
  downloads: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  isApproved: { type: Boolean, default: false }
}

const NoteModel = mongoose.model('notes', noteSchema)

export { UserModel, NoteModel }
