export function createReservationForm() {
    const form = document.createElement('form');
    form.className = 'reservation-form';
    form.id = 'reservationForm';
    
    form.innerHTML = `
        <div class="form-group">
            <label for="fullName">Nombre Completo</label>
            <input type="text" id="fullName" name="fullName" required>
        </div>
        
        <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" required>
        </div>
        
        <div class="form-group">
            <label for="phone">Teléfono</label>
            <input type="tel" id="phone" name="phone" required>
        </div>
        
        <div class="form-group">
            <label for="travelDate">Fecha de Viaje</label>
            <input type="date" id="travelDate" name="travelDate" required>
        </div>
        
        <div class="form-group">
            <label for="passengers">Número de Pasajeros</label>
            <select id="passengers" name="passengers" required>
                <option value="1">1 Pasajero</option>
                <option value="2">2 Pasajeros</option>
                <option value="3">3 Pasajeros</option>
                <option value="4">4 Pasajeros</option>
                <option value="5">5+ Pasajeros</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="vehicleId">Vehículo</label>
            <select id="vehicleId" name="vehicleId" required>
                <!-- Opciones se llenarán dinámicamente -->
            </select>
        </div>
        
        <div class="form-group">
            <label for="notes">Notas Adicionales</label>
            <textarea id="notes" name="notes" rows="3"></textarea>
        </div>
        
        <div class="form-actions">
            <button type="submit" class="btn submit-btn">Confirmar Reserva</button>
        </div>
    `;
    
    return form;
}