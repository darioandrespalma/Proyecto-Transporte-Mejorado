import { createHeader } from '../components/Header.js';
import { createFooter } from '../components/Footer.js';

const routes = {
  '/': () => import('../views/HomeView.js').then(m => m.renderHome()),
  '/about': () => import('../views/AboutView.js').then(m => m.renderAbout()),
  '/contact': () => import('../views/ContactView.js').then(m => m.renderContact()),
  '/reservations': () => import('../views/ReservationsView.js').then(m => m.renderReservations())
};

export async function router() {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app no encontrado en el DOM');
    return;
  }
  
  // Mostrar loader mientras carga
  app.innerHTML = '<div class="loader">Cargando...</div>';
  
  try {
    // Obtener ruta
    const path = window.location.hash.substring(1) || '/';
    
    // Cargar vista dinámicamente
    const viewFunction = routes[path] || routes['/'];
    const view = await viewFunction();
    
    // Renderizar
    app.innerHTML = '';
    app.appendChild(createHeader()); // Cambiado a llamada directa
    app.appendChild(view);
    app.appendChild(createFooter()); // Cambiado a llamada directa
    
    // Manejar clics en enlaces
    document.querySelectorAll('[data-link]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = link.getAttribute('href').replace('#', '');
      });
    });
  } catch (error) {
    console.error('Router error:', error);
    app.innerHTML = '<h2>Error al cargar la página</h2>';
  }
}

// Iniciar router
window.addEventListener('hashchange', router);
window.addEventListener('load', router);