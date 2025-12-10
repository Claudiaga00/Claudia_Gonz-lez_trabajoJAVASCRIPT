// main.js
document.addEventListener('DOMContentLoaded', function(){
  // Resaltar link activo (si coincide la URL)
  const links = document.querySelectorAll('.nav a');
  links.forEach(a => {
    if (location.pathname.endsWith(a.getAttribute('href'))) {
      a.classList.add('active');
    }
  });

  // Cargar noticias desde JSON (AJAX / fetch)
  const noticiasContainer = document.getElementById('noticias-list');
  if (noticiasContainer){
    fetch('noticias.json')
      .then(r => {
        if(!r.ok) throw new Error('Error al cargar noticias');
        return r.json();
      })
      .then(noticias => {
        noticiasContainer.innerHTML = '';
        noticias.forEach(n => {
          const item = document.createElement('article');
          item.className = 'noticia';
          item.innerHTML = `
            <h3>${escapeHtml(n.titulo)}</h3>
            <small>${escapeHtml(n.fecha)}</small>
            <p>${escapeHtml(n.resumen)}</p>
            <p><a href="${escapeHtml(n.link)}">Leer más</a></p>
          `;
          noticiasContainer.appendChild(item);
        });
      })
      .catch(err => {
        noticiasContainer.textContent = 'No se pudieron cargar las noticias.';
        console.error(err);
      });
  }

  // Simple función para escapar HTML (prevención XSS)
  function escapeHtml(s){
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]));
  }
});
