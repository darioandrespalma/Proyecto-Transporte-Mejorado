<<<<<<< HEAD
=======
import { renderHome } from '../views/HomeView.js';
import { renderAbout } from '../views/AboutView.js';
import { renderContact } from '../views/ContactView.js';
import { renderReservations } from '../views/ReservationsView.js';  // ✅ CORRECTO
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
import { createHeader } from '../components/Header.js';
import { createFooter } from '../components/Footer.js';

const routes = {
<<<<<<< HEAD
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
=======
    '/': renderHome,
    '/about': renderAbout,
    '/contact': renderContact,
    '/reservations': renderReservations  // ✅ CORRECTO
};

export async function router() {
    const app = document.getElementById('app');
    app.innerHTML = ''; // Limpiar contenido
    
    // Obtener ruta actual
    const path = window.location.hash.replace('#', '') || '/';
    
    // Renderizar header
    const header = createHeader();
    app.appendChild(header);
    
    // Renderizar vista
    const view = routes[path];
    if (view) {
        const main = await view();
        app.appendChild(main);
    } else {
        app.innerHTML = '<h2>Página no encontrada</h2>';
    }
    
    // Renderizar footer
    const footer = createFooter();
    app.appendChild(footer);
    
    // Manejar clics en enlaces
    document.querySelectorAll('[data-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = link.getAttribute('href').replace('#', '');
            window.location.hash = path;
        });
    });
    
    // Manejar menú móvil
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            document.querySelector('.main-nav').classList.toggle('active');
        });
    }
}

>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
window.addEventListener('hashchange', router);
window.addEventListener('load', router);