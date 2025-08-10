export function createHeader() {
    const header = document.createElement('header');
    header.className = 'app-header';
    
    header.innerHTML = `
        <div class="logo-container">
            <img src="/assets/images/logo.png" alt="Logo Transporte" class="logo">
            <h1>Transporte Seguro</h1>
        </div>
        <nav class="main-nav">
            <ul>
                <li><a href="#/" data-link>Inicio</a></li>
                <li><a href="#/about" data-link>Acerca de</a></li>
                <li><a href="#/reservations" data-link>Mis Reservas</a></li>
                <li><a href="#/contact" data-link>Contacto</a></li>
            </ul>
        </nav>
        <div class="mobile-menu-btn">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    return header;
}