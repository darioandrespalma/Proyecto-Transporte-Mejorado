// frontend/src/views/HomeView.js
import { createBusCard } from '../components/BusCard.js';  // ✅ Crear este componente
<<<<<<< HEAD

// frontend/src/views/HomeView.js
export function renderHome() {
  const main = document.createElement('main');
  main.className = 'home-view';
  
  main.innerHTML = `
    <section class="hero">
      <div class="hero-content">
        <h2>Viaja con Seguridad y Comodidad</h2>
        <p>Reserva tu transporte ahora y disfruta de un viaje inolvidable</p>
        <a href="#/reservations" class="btn hero-btn" data-link>Reservar Ahora</a>
      </div>
    </section>
    
    <section class="services">
      <h2>Nuestros Servicios</h2>
      <div class="services-grid">
        <div class="service-card">
          <h3>Transporte Ejecutivo</h3>
          <p>Viajes corporativos con máxima comodidad y puntualidad</p>
        </div>
        <div class="service-card">
          <h3>Transporte Turístico</h3>
          <p>Descubre nuevos lugares con nuestras rutas turísticas</p>
        </div>
        <div class="service-card">
          <h3>Transporte Escolar</h3>
          <p>Seguridad y confianza para el transporte de tus hijos</p>
        </div>
      </div>
    </section>
    
    <section class="testimonials">
      <h2>Lo que Dicen Nuestros Clientes</h2>
      <div class="testimonial">
        <p>"El mejor servicio de transporte que he usado. ¡Altamente recomendado!"</p>
        <p>- María López</p>
      </div>
    </section>
  `;
=======
import { getBusesDestacados } from '../js/services/api.js';

export async function renderHome() {
  const main = document.createElement('main');
  main.className = 'home-view';
  
  try {
    const buses = await getBusesDestacados();
    
    main.innerHTML = `
      <section class="hero">
        <div class="hero-content">
          <h2>Viaja con Seguridad y Comodidad</h2>
          <p>Reserva tu transporte ahora y disfruta de un viaje inolvidable</p>
          <a href="#/reservations" class="btn hero-btn" data-link>Reservar Ahora</a>
        </div>
      </section>
      
      <section class="featured-vehicles">
        <h2>Nuestros Buses Destacados</h2>
        <div class="vehicles-grid">
          ${buses.slice(0, 3).map(bus => 
            createBusCard(bus).outerHTML
          ).join('')}
        </div>
      </section>
      
      <section class="services">
        <h2>Nuestros Servicios</h2>
        <div class="services-grid">
          <div class="service-card">
            <h3>Transporte Ejecutivo</h3>
            <p>Viajes corporativos con máxima comodidad y puntualidad</p>
          </div>
          <div class="service-card">
            <h3>Transporte Turístico</h3>
            <p>Descubre nuevos lugares con nuestras rutas turísticas</p>
          </div>
          <div class="service-card">
            <h3>Transporte Escolar</h3>
            <p>Seguridad y confianza para el transporte de tus hijos</p>
          </div>
        </div>
      </section>
      
      <section class="testimonials">
        <h2>Lo que Dicen Nuestros Clientes</h2>
        <div class="testimonial">
          <p>"El mejor servicio de transporte que he usado. ¡Altamente recomendado!"</p>
          <p>- María López</p>
        </div>
      </section>
    `;
  } catch (error) {
    main.innerHTML = `
      <div class="error-message">
        <h2>Error al cargar los buses</h2>
        <p>${error.message}</p>
      </div>
    `;
  }
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
  
  return main;
}