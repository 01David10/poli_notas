document.addEventListener('DOMContentLoaded', () => {
  // === 1. Búsqueda por nombre en cards ===
  const searchInput = document.querySelector('.search-btn input')
  const apunteCards = document.querySelectorAll('.apunte-card')

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase()
      apunteCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase()
        card.style.display = title.includes(searchTerm) ? 'block' : 'none'
      })
    })
  }

  // === 2. Redirección por título de apunte ===
  apunteCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase()
    let redirectURL = '#'

    if (title.includes('álgebra')) {
      redirectURL = 'algebra.html'
    } else if (title.includes('algoritmos')) {
      redirectURL = 'algoritmos.html'
    } else if (title.includes('base de datos')) {
      redirectURL = 'basededatos.html'
    }

    card.style.cursor = 'pointer'
    card.addEventListener('click', () => {
      if (redirectURL !== '#') {
        window.location.href = redirectURL
      }
    })
  })

  // === 3. Filtro por nombre o autor ===
  const buscador = document.getElementById('buscador')
  if (buscador) {
    buscador.addEventListener('keyup', function () {
      const filtro = buscador.value.toLowerCase()

      apunteCards.forEach(card => {
        const titulo = card.querySelector('h3').textContent.toLowerCase()
        const autor = card.querySelector('.autor')?.textContent.toLowerCase() || ''

        card.style.display = (titulo.includes(filtro) || autor.includes(filtro)) ? 'block' : 'none'
      })
    })
  }

  // === 4. Mostrar tabla con apuntes por materia ===
  const materiaCards = document.querySelectorAll('.materia-card')
  const notasSection = document.getElementById('notas-section')
  const notasTableBody = document.querySelector('#notas-table tbody')

  materiaCards.forEach(card => {
    card.addEventListener('click', async () => {
      const subject = card.dataset.subject
      if (!subject) return

      try {
        const res = await fetch(`http://localhost:3000/notes/notesBySubject?subject=${encodeURIComponent(subject)}`)
        const data = await res.json()

        notasTableBody.innerHTML = ''

        if (!Array.isArray(data) || data.length === 0) {
          notasTableBody.innerHTML = '<tr><td colspan="4">No hay apuntes para esta materia.</td></tr>'
        } else {
          data.forEach(nota => {
            const row = document.createElement('tr')
            row.innerHTML = `
              <td>${nota.title}</td>
              <td>${nota.uploaderName}</td>
              <td>${nota.date}</td>
              <td><a href="${nota._URL}" target="_blank">Ver</a></td>
            `
            notasTableBody.appendChild(row)
          })
        }

        notasSection.style.display = 'block'
        notasSection.scrollIntoView({ behavior: 'smooth' })
      } catch (err) {
        console.error('Error al cargar apuntes:', err)
        notasTableBody.innerHTML = '<tr><td colspan="4">Error al cargar apuntes.</td></tr>'
        notasSection.style.display = 'block'
      }
    })
  })
})
