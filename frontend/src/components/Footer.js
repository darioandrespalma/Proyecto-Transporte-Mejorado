export function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'app-footer';
    
    footer.innerHTML = `
        <div class="footer-content">
            <div class="footer-section">
                <h3>Transporte Seguro</h3>
                <p>Tu solución confiable para viajes</p>
            </div>
            <div class="footer-section">
                <h4>Enlaces Rápidos</h4>
                <ul>
                    <li><a href="#/" data-link>Inicio</a></li>
                    <li><a href="#/about" data-link>Acerca de</a></li>
                    <li><a href="#/reservations" data-link>Reservas</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Contacto</h4>
                <p>contacto@transporteseguro.com</p>
                <p>+1 234 567 890</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} Transporte Seguro. Todos los derechos reservados.</p>
        </div>
    `;
    
    return footer;
}