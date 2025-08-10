import { createReservationForm } from '../components/ReservationForm.js';
import { getVehiculos } from '../js/services/api.js';
import { addReservation } from '../js/controllers/ReservationController.js';

export async function renderReservations() {
    const main = document.createElement('main');
    main.className = 'reservations-view';
    
    try {
        const vehiculos = await getVehiculos();
        
        main.innerHTML = `
            <section class="reservations-hero">
                <h2>Mis Reservas</h2>
                <p>Gestiona tus reservas existentes o crea una nueva</p>
            </section>
            
            <div class="reservations-container">
                <div class="reservation-form-container">
                    <h3>Nueva Reserva</h3>
                    ${createReservationForm().outerHTML}
                </div>
                
                <div class="reservations-list">
                    <h3>Tus Reservas Activas</h3>
                    <div class="reservations-grid" id="reservationsGrid">
                        <p>Cargando reservas...</p>
                    </div>
                </div>
            </div>
        `;
        
        // Llenar select de vehículos
        const vehicleSelect = main.querySelector('#vehicleId');
        vehiculos.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.id;
            option.textContent = `${vehicle.marca} ${vehicle.modelo} (${vehicle.placa})`;
            vehicleSelect.appendChild(option);
        });
        
        // Manejar envío de formulario
        const form = main.querySelector('#reservationForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const reservationData = {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                travelDate: formData.get('travelDate'),
                passengers: formData.get('passengers'),
                vehicleId: formData.get('vehicleId'),
                notes: formData.get('notes')
            };
            
            try {
                await addReservation(reservationData);
                alert('Reserva creada con éxito');
                form.reset();
                // Actualizar lista de reservas
            } catch (error) {
                alert(`Error al crear reserva: ${error.message}`);
            }
        });
    } catch (error) {
        main.innerHTML = `
            <div class="error-message">
                <h2>Error al cargar la información</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
    
    return main;
}