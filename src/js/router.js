import { renderHome } from '../views/HomeView.js';
import { renderAbout } from '../views/AboutView.js';
import { renderContact } from '../views/ContactView.js';
import { renderReservations } from '../views/ReservationsView.js';
import { createHeader } from '../components/Header.js';
import { createFooter } from '../components/Footer.js';

const routes = {
    '/': renderHome,
    '/about': renderAbout,
    '/contact': renderContact,
    '/reservations': renderReservations
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

window.addEventListener('hashchange', router);
window.addEventListener('load', router);