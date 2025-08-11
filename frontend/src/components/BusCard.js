// frontend/src/components/BusCard.js
export function createBusCard(bus) {
  const card = document.createElement('div');
  card.className = 'vehicle-card';
  
  card.innerHTML = `
    <img src="/public/bus.jpg" alt="${bus.marca || 'Bus'}">
    <div class="card-content">
      <h3>Bus #${bus.numero_bus}</h3>
      <p>Ruta: ${bus.ruta_nombre}</p>
      <p>Capacidad: ${bus.capacidad} pasajeros</p>
      <div class="card-actions">
        <button class="btn reserve-btn" data-id="${bus.id}" data-link>Reservar</button>
      </div>
    </div>
  `;
  
  return card;
}