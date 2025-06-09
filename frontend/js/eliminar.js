const users = [
  { cedula: '123456789', correo: 'usuario1@example.com' },
  { cedula: '987654321', correo: 'usuario2@example.com' }
]

function renderUsers () {
  const table = document.getElementById('user-table')
  table.innerHTML = ''

  users.forEach((user, index) => {
    const row = document.createElement('tr')
    row.innerHTML = `
      <td><input type="radio" name="selectedUser" value="${index}" /></td>
      <td>${user.cedula}</td>
      <td>${user.correo}</td>
    `
    table.appendChild(row)
  })
}

function deleteSelectedUser () {
  const selected = document.querySelector('input[name="selectedUser"]:checked')
  if (!selected) {
    alert('Por favor selecciona un usuario para eliminar.')
    return
  }

  const index = parseInt(selected.value)
  const confirmDelete = confirm(`¿Eliminar usuario con cédula ${users[index].cedula}?`)
  if (confirmDelete) {
    users.splice(index, 1)
    renderUsers()
  }
}

renderUsers()
