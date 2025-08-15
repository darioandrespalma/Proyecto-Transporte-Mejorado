// src/js/components/Header.js
export function createHeader() {
  const header = document.createElement('header');
  header.className = 'main-header';
  header.innerHTML = `
    <nav class="main-nav">
      <a href="#/" data-link>Inicio</a>
      <a href="#/about" data-link>Nosotros</a>
      <a href="#/contact" data-link>Contacto</a>
      <a href="#/reservations" data-link>Reservas</a>
    </nav>
  `;
  return header;
}