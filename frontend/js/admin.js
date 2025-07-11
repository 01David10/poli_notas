// Global variables
let users = []
let currentUser = null
let isEditing = false

// Initialize the application
function init () {
  bindEvents()
  loadUsers()
}

// Bind event listeners
function bindEvents () {
  // Modal events
  document
    .getElementById('addUserBtn')
    .addEventListener('click', () => openModal())
  document
    .getElementById('closeModal')
    .addEventListener('click', () => closeModal())
  document
    .getElementById('cancelBtn')
    .addEventListener('click', () => closeModal())
  document
    .getElementById('userForm')
    .addEventListener('submit', (e) => handleSubmit(e))

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('userModal')) {
      closeModal()
    }
  })
}

// Load users from API
async function loadUsers () {
  try {
    const response = await fetch('/users/getAllUsers')

    if (!response.ok) {
      throw new Error('Error al cargar usuarios')
    }

    users = await response.json()
    renderUsers()
  } catch (error) {
    console.error('Error:', error)
    showMessage('Error al cargar usuarios', 'error')
  }
}

// Render users in table
function renderUsers () {
  const tbody = document.getElementById('usersTableBody')
  const table = document.getElementById('usersTable')
  const emptyState = document.getElementById('emptyState')

  if (users.length === 0) {
    table.style.display = 'none'
    emptyState.style.display = 'block'
    return
  }

  table.style.display = 'table'
  emptyState.style.display = 'none'

  tbody.innerHTML = users
    .map(
      (user) => `
    <tr>
      <td>${user.name}</td>
      <td>${user.dni}</td>
      <td>${user.email}</td>
      <td><span class="role-badge role-${user.role}">${getRoleText(
        user.role
      )}</span></td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editUser('${
          user.dni
        }')">
          Editar
        </button>
        <button class="btn btn-danger btn-sm" onclick="deleteUser('${
          user.dni
        }')">
          Eliminar
        </button>
      </td>
    </tr>
  `
    )
    .join('')
}

// Get role text in Spanish
function getRoleText (role) {
  const roleMap = {
    student: 'Estudiante',
    teacher: 'Profesor',
    admin: 'Administrador'
  }
  return roleMap[role] || role
}

// Open modal for add/edit
function openModal (user = null) {
  const modal = document.getElementById('userModal')
  const modalTitle = document.getElementById('modalTitle')
  const form = document.getElementById('userForm')
  const passwordField = document.getElementById('userPassword')
  const dniField = document.getElementById('userDni')

  if (user) {
    isEditing = true
    currentUser = user
    modalTitle.textContent = 'Editar Usuario'

    // Fill form with user data
    document.getElementById('userName').value = user.name
    document.getElementById('userDni').value = user.dni
    document.getElementById('userEmail').value = user.email
    document.getElementById('userRole').value = user.role

    // Make password optional for editing
    passwordField.required = false
    passwordField.placeholder = 'Dejar vacío para mantener la contraseña actual'

    // Disable DNI field when editing
    dniField.readOnly = true
    dniField.style.backgroundColor = '#f8f9fa'
  } else {
    isEditing = false
    currentUser = null
    modalTitle.textContent = 'Agregar Usuario'
    form.reset()
    passwordField.required = true
    passwordField.placeholder = ''
    dniField.readOnly = false
    dniField.style.backgroundColor = ''
  }

  modal.style.display = 'block'
}

// Close modal
function closeModal () {
  document.getElementById('userModal').style.display = 'none'
  document.getElementById('userForm').reset()
  currentUser = null
  isEditing = false
}

// Handle form submission
async function handleSubmit (e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const userData = Object.fromEntries(formData.entries())

  // If editing and password is empty, remove it from data
  if (isEditing && !userData.password) {
    delete userData.password
  }

  try {
    if (isEditing) {
      await updateUser(userData)
    } else {
      await createUser(userData)
    }
  } catch (error) {
    console.error('Error:', error)
    showMessage('Error al guardar usuario', 'error')
  }
}

// Create new user
async function createUser (userData) {
  const response = await fetch('/users/createUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al crear usuario')
  }

  showMessage('Usuario creado exitosamente', 'success')
  closeModal()
  loadUsers()
}

// Update existing user
async function updateUser (userData) {
  const response = await fetch(`/users/updateUser/${currentUser.dni}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al actualizar usuario')
  }

  showMessage('Usuario actualizado exitosamente', 'success')
  closeModal()
  loadUsers()
}

// Edit user
function editUser (dni) {
  const user = users.find((u) => u.dni === dni)
  if (user) {
    openModal(user)
  }
}

// Delete user
async function deleteUser (dni) {
  if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
    return
  }

  try {
    const response = await fetch(`/users/deleteUser/${dni}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al eliminar usuario')
    }

    showMessage('Usuario eliminado exitosamente', 'success')
    loadUsers()
  } catch (error) {
    console.error('Error:', error)
    showMessage('Error al eliminar usuario', 'error')
  }
}

// Show message
function showMessage (message, type) {
  const container = document.getElementById('messageContainer')
  const messageDiv = document.createElement('div')
  messageDiv.className = type
  messageDiv.textContent = message

  container.innerHTML = ''
  container.appendChild(messageDiv)

  setTimeout(() => {
    container.innerHTML = ''
  }, 5000)
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init)
