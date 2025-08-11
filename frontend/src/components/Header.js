export function createHeader() {
    const header = document.createElement('header');
    header.className = 'app-header';
    header.setAttribute('role', 'banner');
    
    header.innerHTML = `
        <div class="logo-container">
            <img src="/public/logo2.png" alt="Logo Transporte Interprovincial" class="logo">
            <h1>Transporte Seguro</h1>
        </div>
        <nav class="main-nav" aria-label="Navegación principal">
            <ul>
                <li><a href="#/" data-link aria-current="page">Inicio</a></li>
                <li><a href="#/about" data-link>Acerca de</a></li>
                <li><a href="#/reservations" data-link>Mis Reservas</a></li>
                <li><a href="#/contact" data-link>Contacto</a></li>
            </ul>
        </nav>
        <button class="mobile-menu-btn" aria-label="Menú móvil" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
        </button>
    `;
    
    return header;
}