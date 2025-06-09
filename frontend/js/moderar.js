// Suponiendo que tienes un endpoint para obtener apuntes pendientes
fetch('http://localhost:3000/apuntes/pendientes') // <-- cambia esto según tu backend
  .then(res => res.json())
  .then(apuntes => {
    const contenedor = document.getElementById('moderacion-container')

    apuntes.forEach(apunte => {
      const card = document.createElement('div')
      card.className = 'apunte-card'
      card.innerHTML = `
        <i class="fas fa-folder-open fa-3x"></i>
        <h3>${apunte.titulo}</h3>
        <p class="autor">${apunte.autor}</p>
        <p class="materia">${apunte.materia}</p>
        <div class="acciones">
          <button class="aprobar">Aprobar</button>
          <button class="rechazar">Rechazar</button>
        </div>
      `

      // Acción aprobar
      card.querySelector('.aprobar').addEventListener('click', () => {
        fetch(`http://localhost:3000/apuntes/${apunte._id}/aprobar`, {
          method: 'PUT'
        }).then(() => card.remove())
      })

      // Acción rechazar
      card.querySelector('.rechazar').addEventListener('click', () => {
        fetch(`http://localhost:3000/apuntes/${apunte._id}`, {
          method: 'DELETE'
        }).then(() => card.remove())
      })

      contenedor.appendChild(card)
    })
  })
