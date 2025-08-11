export function createVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    
    card.innerHTML = `
        <img src="/assets/images/${vehicle.image}" alt="${vehicle.marca} ${vehicle.modelo}">
        <div class="card-content">
            <h3>${vehicle.marca} ${vehicle.modelo}</h3>
            <p>Placa: ${vehicle.placa}</p>
            <p>Capacidad: ${vehicle.capacidad} pasajeros</p>
            <div class="card-actions">
                <button class="btn reserve-btn" data-id="${vehicle.id}">Reservar</button>
            </div>
        </div>
    `;
    
    return card;
}