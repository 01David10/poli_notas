/* eslint-disable no-undef */
const logoutButton = document.getElementById('logoutButton')

logoutButton.addEventListener('click', (event) => {
  logout()
})

async function logout () {
  try {
    const response = await fetch('http://localhost:3000/session/logout', {
      method: 'POST',
      credentials: 'include'
    })

    if (response.ok) {
      Swal.fire('Logout', 'You have been logged out', 'success').then(() => {
        window.location.href = '/login'
      })
    } else {
      Swal.fire('Logout failed', 'Please try again later', 'error')
    }
  } catch (error) {
    Swal.fire('Connection failed', error, 'error')
  }
}
