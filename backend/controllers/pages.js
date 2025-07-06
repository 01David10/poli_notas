import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url) // obtiene la ruta del archivo actual (ya que no se puede usar __dirname por estar en módulos ES)
const __dirname = path.dirname(__filename) // obtiene la ruta del directorio actual

function getLoginPage (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/html/login.html'))
}

function getIndexPage (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/html/index.html'))
}

function getProfilePage (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/html/profile.html'))
}

function getRegisterPage (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/html/register.html'))
}

function getNotesPage (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/html/notes.html'))
}

export { getLoginPage, getIndexPage, getProfilePage, getRegisterPage, getNotesPage }
