/* eslint-disable no-undef */
const loginButton = document.getElementById('login-button')

loginButton.addEventListener('click', () => {
  login()
})

async function login () {
  try {
    const email = document.getElementById('floating-email').value
    const password = document.getElementById('floating-password').value

    const response = await fetch('http://localhost:3000/session/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (response.ok) {
      Swal.fire('Welcome', data.name, 'success').then(() => {
        window.location.href = '/index'
      })
    } else {
      Swal.fire(
        'Login failed',
        'Please verify your email and password',
        'error'
      )
    }
  } catch (error) {
    Swal.fire('Connection failed', error, 'error')
  }
}
window.abrirModal = function () {
  document.getElementById('modal').style.display = 'block'
}
window.cerrarModal = function () {
  document.getElementById('modal').style.display = 'none'
}
window.verificarYModificar = async function () {
  const email = document.getElementById('email').value
  const dni = document.getElementById('dni').value
  const nuevaContra = document.getElementById('nuevaContra').value
  const mensaje = document.getElementById('mensaje')

  mensaje.textContent = 'Validando...'
  mensaje.style.color = 'black'

  try {
    const res = await fetch('http://localhost:3000/session/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, dni, newPassword: nuevaContra })
    })

    const data = await res.json()

    if (res.ok) {
      mensaje.textContent = data.message || 'Contraseña actualizada correctamente.'
      mensaje.style.color = 'green'
      setTimeout(() => window.cerrarModal(), 2000)
    } else {
      mensaje.textContent = data.message || 'No se pudo actualizar la contraseña.'
      mensaje.style.color = 'red'
    }
  } catch (err) {
    mensaje.textContent = 'Error al conectar con el servidor.'
    mensaje.style.color = 'red'
  }
}
