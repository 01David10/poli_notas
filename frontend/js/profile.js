/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', async () => {
  dni = await getLoggedUser()
  const profile = await getUserByDni(dni)

  if (profile) {
    await fetchProfile(profile)
  } else {
    errorAlert('Profile not found. Please check your username.')
  }
})

async function fetchProfile (profile) {
  const name = document.getElementById('name')
  const email = document.getElementById('email')
  try {
    name.value = profile.name
    email.value = profile.email
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}

// get logged user
async function getLoggedUser () {
  try {
    const response = await fetch('http://localhost:3000/session/loggedUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    return data.user.dni
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

async function getUserByDni (dni) {
  try {
    const response = await fetch(
      `http://localhost:3000/users/getUserById/${dni}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching user by DNI:', error)
  }
}

// upload file
const btnUpload = document.getElementById('btn-upload')

btnUpload.addEventListener('click', async (e) => {
  await uploadFile()
})

async function uploadFile () {
  const fileInput = document.getElementById('input-file')
  const fileName = document.getElementById('file-name')
  const fileSubject = document.getElementById('floating-subject')

  const formData = new FormData()

  formData.append('file', fileInput.files[0])
  formData.append('title', fileName.value)
  formData.append('subject', fileSubject.value)

  try {
    const response = await fetch('http://localhost:3000/notes/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })

    const result = await response.json()
    console.log(result)

    if (response.ok) {
      successAlert('File uploaded successfully!')
    } else {
      errorAlert('Failed to upload file. Please try again.')
    }
  } catch (error) {
    console.error('Error uploading file:', error)
  }
}

// show user notes
document.addEventListener('DOMContentLoaded', async () => {
  await showUserNotes()
})

async function showUserNotes () {
  const notesGrid = document.querySelector('.notes-column .notes-grid')

  try {
    const response = await fetch('http://localhost:3000/notes/userNotes', {
      method: 'GET',
      credentials: 'include'
    })

    const notes = await response.json()

    if (!Array.isArray(notes)) {
      throw new Error('Invalid response format')
    }

    notesGrid.innerHTML = ''

    notes.forEach((note) => {
      const card = document.createElement('div')
      card.classList.add('note-card')

      const avgRating =
        note.rating.length > 0
          ? (
              note.rating.reduce((acc, val) => acc + val, 0) /
              note.rating.length
            ).toFixed(1)
          : 'N/A'

      card.innerHTML = `
        <img src="../img/librodescargar.png" class="note-icon" alt="icon" />
        <strong>${note.title}</strong><br />
        ⭐ ${avgRating} <br />
        🔥 ${note.downloads || 0} downloads
      `

      card.onclick = () => {
        window.open(note.URL, '_blank')
      }

      notesGrid.appendChild(card)
    })
  } catch (err) {
    console.error('Error loading user notes:', err)
  }
}

// update profile
const btnUpdate = document.getElementById('btn-update')
const btnSaveChanges = document.getElementById('btn-save-changes')

btnUpdate.addEventListener('click', async () => {
  await fetchUser()
})

async function fetchUser () {
  dni = await getLoggedUser()
  const profile = await getUserByDni(dni)

  const name = document.getElementById('edit-name')
  const email = document.getElementById('edit-email')
  const role = document.getElementById('edit-role')
  const dniInput = document.getElementById('edit-document')

  try {
    name.value = profile.name
    email.value = profile.email
    role.value = profile.role
    dniInput.value = profile.dni
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}

btnSaveChanges.addEventListener('click', async () => {
  await updateProfile()
})

function getNewInputValues () {
  const newDni = document.getElementById('edit-document').value
  const newEmail = document.getElementById('edit-email').value
  const newName = document.getElementById('edit-name').value
  const newPassword = document.getElementById('edit-password').value
  const newRole = document.getElementById('edit-role').value

  const user = {
    name: newName,
    dni: newDni,
    email: newEmail,
    password: newPassword,
    role: newRole
  }
  return user
}

async function udpateUser (dni, user) {
  try {
    const response = await fetch(
      `http://localhost:3000/users/updateUser/${dni}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
        credentials: 'include'
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

async function updateProfile () {
  try {
    dni = await getLoggedUser()
    const user = getNewInputValues()
    const userUdpate = await udpateUser(dni, user)

    if (userUdpate) {
      // close modal
      const modalElement = document.getElementById('editUserModal')
      await closeModal(modalElement)

      const updatedName = document.getElementById('edit-name').value
      const updatedEmail = document.getElementById('edit-email').value
      const updatedRole = document.getElementById('edit-role').value
      const updatedDocument = document.getElementById('edit-document').value

      // update profile inputs
      document.getElementById('name').value = updatedName
      document.getElementById('email').value = updatedEmail
      document.getElementById('edit-name').value = updatedName
      document.getElementById('edit-email').value = updatedEmail
      document.getElementById('edit-role').value = updatedRole
      document.getElementById('edit-document').value = updatedDocument

      successAlert('Profile updated successfully!')
    } else {
      errorAlert('Failed to update profile. Please try again')
    }
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}

async function closeModal (modal) {
  const modalInstance = bootstrap.Modal.getOrCreateInstance(modal)
  modalInstance.hide()
}

async function successAlert (message) {
  Swal.fire({
    icon: 'success',
    title: 'Success',
    text: message || 'Operation completed successfully.',
    confirmButtonText: 'OK'
  })
}

async function errorAlert (message) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message || 'There was an error processing your request.',
    confirmButtonText: 'OK'
  })
}
