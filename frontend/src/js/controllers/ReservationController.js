// src/js/controllers/ReservationController.js
import { 
    getRutas, 
    getFrecuencias, 
    getVehiculos, 
    getAsientos, 
    createPasajero,
    createReserva,
    confirmarReserva
} from '../services/api.js';

export async function initReservationForm() {
    // Cargar rutas al inicio
    const rutas = await getRutas();
    const rutaSelect = document.getElementById('ruta');
    
    rutas.forEach(ruta => {
        const option = document.createElement('option');
        option.value = ruta.id;
        option.textContent = `${ruta.origen} - ${ruta.destino} (${ruta.duracion_estimada})`;
        rutaSelect.appendChild(option);
    });
    
    // Manejar cambio de ruta
    rutaSelect.addEventListener('change', async (e) => {
        const frecuenciaSelect = document.getElementById('frecuencia');
        frecuenciaSelect.innerHTML = '<option value="">Cargando horarios...</option>';
        frecuenciaSelect.disabled = true;
        
        if (e.target.value) {
            const frecuencias = await getFrecuencias(e.target.value);
            frecuenciaSelect.innerHTML = '<option value="">Seleccione un horario...</option>';
            
            frecuencias.forEach(frecuencia => {
                const option = document.createElement('option');
                option.value = frecuencia.id;
                option.textContent = `${frecuencia.hora_salida} - ${frecuencia.hora_llegada} (${frecuencia.dias_semana})`;
                frecuenciaSelect.appendChild(option);
            });
            
            frecuenciaSelect.disabled = false;
        } else {
            frecuenciaSelect.innerHTML = '<option value="">Primero seleccione una ruta</option>';
            frecuenciaSelect.disabled = true;
        }
    });
    
    // Manejar cambio de frecuencia
    document.getElementById('frecuencia').addEventListener('change', async (e) => {
        const vehiculoSelect = document.getElementById('vehiculo');
        vehiculoSelect.innerHTML = '<option value="">Cargando buses...</option>';
        vehiculoSelect.disabled = true;
        
        if (e.target.value) {
            const rutaId = document.getElementById('ruta').value;
            const vehiculos = await getVehiculos(rutaId);
            vehiculoSelect.innerHTML = '<option value="">Seleccione un bus...</option>';
            
            vehiculos.forEach(vehiculo => {
                const option = document.createElement('option');
                option.value = vehiculo.id;
                option.textContent = `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.placa}) - ${vehiculo.capacidad} asientos`;
                vehiculoSelect.appendChild(option);
            });
            
            vehiculoSelect.disabled = false;
        } else {
            vehiculoSelect.innerHTML = '<option value="">Primero seleccione una frecuencia</option>';
            vehiculoSelect.disabled = true;
        }
    });
    
    // Manejar cambio de vehículo (mostrar asientos)
    document.getElementById('vehiculo').addEventListener('change', async (e) => {
        const asientosContainer = document.getElementById('asientos-container');
        asientosContainer.innerHTML = '<p>Cargando asientos disponibles...</p>';
        
        if (e.target.value) {
            const asientos = await getAsientos(e.target.value);
            renderAsientos(asientos);
        } else {
            asientosContainer.innerHTML = '<p>Primero seleccione un bus</p>';
        }
    });
    
    // Manejar método de pago
    document.querySelectorAll('input[name="metodo_pago"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('.payment-fields').forEach(field => {
                field.hidden = true;
            });
            
            if (e.target.value === 'transferencia') {
                document.getElementById('transferencia-fields').hidden = false;
            } else if (e.target.value === 'tarjeta') {
                document.getElementById('tarjeta-fields').hidden = false;
            }
        });
    });
    
    // Manejar envío del formulario
    document.getElementById('reservationForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validar formulario
        if (!validateForm()) {
            return;
        }
        
        // Mostrar resumen de reserva
        await showReservationSummary();
    });
    
    // Manejar confirmación de reserva
    document.addEventListener('click', async (e) => {
        if (e.target.id === 'confirmReservation') {
            await processReservation();
        }
    });
}

function validateForm() {
    let isValid = true;
    
    // Validar cédula
    const cedula = document.getElementById('cedula');
    if (!cedula.value.match(/^[0-9]{10}$/)) {
        document.getElementById('cedula-error').textContent = 'La cédula debe tener 10 dígitos';
        isValid = false;
    } else {
        document.getElementById('cedula-error').textContent = '';
    }
    
    // Validar que se hayan seleccionado asientos
    const selectedSeats = document.querySelectorAll('.asiento.selected').length;
    if (selectedSeats === 0) {
        alert('Debe seleccionar al menos un asiento');
        isValid = false;
    }
    
    // Validar método de pago
    const metodoPago = document.querySelector('input[name="metodo_pago"]:checked');
    if (!metodoPago) {
        alert('Seleccione un método de pago');
        isValid = false;
    }
    
    return isValid;
}

function renderAsientos(asientos) {
    const asientosContainer = document.getElementById('asientos-container');
    asientosContainer.innerHTML = '';
    
    // Agrupar asientos por fila
    const filas = {};
    asientos.forEach(asiento => {
        if (!filas[asiento.fila]) {
            filas[asiento.fila] = [];
        }
        filas[asiento.fila].push(asiento);
    });
    
    // Crear visualización de asientos
    const busLayout = document.createElement('div');
    busLayout.className = 'bus-layout';
    
    // Mostrar pasillo
    const pasillo = document.createElement('div');
    pasillo.className = 'pasillo';
    pasillo.textContent = 'Pasillo';
    busLayout.appendChild(pasillo);
    
    // Crear filas de asientos
    Object.keys(filas).sort().forEach(filaNum => {
        const fila = document.createElement('div');
        fila.className = 'fila';
        
        const filaLabel = document.createElement('span');
        filaLabel.className = 'fila-label';
        filaLabel.textContent = `Fila ${filaNum}`;
        fila.appendChild(filaLabel);
        
        filas[filaNum].sort((a, b) => {
            // Ordenar asientos: ventana izquierda, pasillo izquierdo, pasillo derecho, ventana derecha
            const order = { 'ventana_izquierda': 0, 'pasillo_izquierdo': 1, 'pasillo_derecho': 2, 'ventana_derecha': 3 };
            return order[a.ubicacion] - order[b.ubicacion];
        }).forEach(asiento => {
            const asientoElement = document.createElement('button');
            asientoElement.className = 'asiento';
            asientoElement.dataset.id = asiento.id;
            asientoElement.dataset.numero = asiento.numero;
            asientoElement.dataset.ubicacion = asiento.ubicacion;
            
            // Agregar clase según ubicación
            if (asiento.ubicacion.includes('ventana')) {
                asientoElement.classList.add('ventana');
            } else {
                asientoElement.classList.add('pasillo');
            }
            
            if (asiento.ubicacion.includes('izquierda') || asiento.ubicacion.includes('izquierdo')) {
                asientoElement.classList.add('izquierda');
            } else {
                asientoElement.classList.add('derecha');
            }
            
            asientoElement.innerHTML = `
                <span class="numero">${asiento.numero}</span>
                <span class="ubicacion" aria-hidden="true">${asiento.ubicacion.split('_')[0]}</span>
            `;
            
            asientoElement.addEventListener('click', (e) => {
                e.preventDefault();
                asientoElement.classList.toggle('selected');
                updateSelectedSeats();
            });
            
            fila.appendChild(asientoElement);
        });
        
        busLayout.appendChild(fila);
    });
    
    asientosContainer.appendChild(busLayout);
}

function updateSelectedSeats() {
    const selectedSeats = document.querySelectorAll('.asiento.selected');
    const selectedSeatsContainer = document.getElementById('asientos-seleccionados');
    
    if (selectedSeats.length > 0) {
        selectedSeatsContainer.innerHTML = `
            <p>Asientos seleccionados: ${Array.from(selectedSeats)
                .map(seat => seat.dataset.numero)
                .join(', ')}</p>
        `;
    } else {
        selectedSeatsContainer.innerHTML = '';
    }
    
    // Validar que no se exceda el límite de 40 asientos
    if (selectedSeats.length > 40) {
        alert('No puede reservar más de 40 asientos');
        selectedSeats.forEach(seat => seat.classList.remove('selected'));
        updateSelectedSeats();
    }
}

async function showReservationSummary() {
    const form = document.getElementById('reservationForm');
    const formData = new FormData(form);
    
    // Obtener datos de los selects
    const rutaId = formData.get('ruta');
    const frecuenciaId = formData.get('frecuencia');
    const vehiculoId = formData.get('vehiculo');
    
    // Obtener detalles adicionales
    const [ruta, frecuencia, vehiculo] = await Promise.all([
        getRutaDetails(rutaId),
        getFrecuenciaDetails(frecuenciaId),
        getVehiculoDetails(vehiculoId)
    ]);
    
    // Obtener asientos seleccionados
    const selectedSeats = Array.from(document.querySelectorAll('.asiento.selected'))
        .map(seat => ({
            id: seat.dataset.id,
            numero: seat.dataset.numero,
            ubicacion: seat.dataset.ubicacion
        }));
    
    // Mostrar resumen
    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = `
        <div class="summary-section">
            <h3>Datos Personales</h3>
            <p><strong>Nombre:</strong> ${formData.get('nombre')} ${formData.get('apellido')}</p>
            <p><strong>Cédula:</strong> ${formData.get('cedula')}</p>
            <p><strong>Email:</strong> ${formData.get('email')}</p>
            <p><strong>Teléfono:</strong> ${formData.get('telefono')}</p>
        </div>
        
        <div class="summary-section">
            <h3>Detalles del Viaje</h3>
            <p><strong>Ruta:</strong> ${ruta.origen} - ${ruta.destino}</p>
            <p><strong>Fecha/Hora:</strong> ${new Date(frecuencia.hora_salida).toLocaleString()}</p>
            <p><strong>Bus:</strong> ${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.placa})</p>
        </div>
        
        <div class="summary-section">
            <h3>Asientos</h3>
            <p>${selectedSeats.map(s => `Asiento ${s.numero} (${s.ubicacion.split('_')[0]})`).join(', ')}</p>
            <p><strong>Total a pagar:</strong> $${(selectedSeats.length * 15).toFixed(2)}</p>
        </div>
        
        <div class="summary-section">
            <h3>Método de Pago</h3>
            <p>${formData.get('metodo_pago') === 'transferencia' ? 'Transferencia Bancaria' : 'Tarjeta de Crédito/Débito'}</p>
        </div>
    `;
    
    // Mostrar sección de resumen
    document.getElementById('reservationSummary').hidden = false;
    form.scrollIntoView({ behavior: 'smooth' });
}

async function processReservation() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const reservationSummary = document.getElementById('reservationSummary');
    const reservationResult = document.getElementById('reservationResult');
    
    // Mostrar indicador de carga
    loadingIndicator.hidden = false;
    reservationSummary.hidden = true;
    
    try {
        const form = document.getElementById('reservationForm');
        const formData = new FormData(form);
        
        // 1. Registrar pasajero
        const pasajeroData = {
            cedula: formData.get('cedula'),
            nombre: formData.get('nombre'),
            apellido: formData.get('apellido'),
            direccion: formData.get('direccion'),
            telefono: formData.get('telefono'),
            email: formData.get('email')
        };
        
        const pasajero = await createPasajero(pasajeroData);
        
        // 2. Crear reserva
        const selectedSeats = Array.from(document.querySelectorAll('.asiento.selected'))
            .map(seat => parseInt(seat.dataset.id));
        
        const reservaData = {
            pasajero_id: pasajero.id,
            frecuencia_id: formData.get('frecuencia'),
            vehiculo_id: formData.get('vehiculo'),
            asientos: selectedSeats,
            metodo_pago: formData.get('metodo_pago'),
            monto_total: selectedSeats.length * 15 // Precio fijo por asiento
        };
        
        // Si es transferencia, subir comprobante
        if (formData.get('metodo_pago') === 'transferencia' && formData.get('comprobante')) {
            reservaData.comprobante_pago = await uploadComprobante(formData.get('comprobante'));
        }
        
        const reserva = await createReserva(reservaData);
        
        // 3. Confirmar reserva y emitir factura
        const reservaConfirmada = await confirmarReserva(reserva.id);
        
        // Mostrar resultado
        reservationResult.innerHTML = `
            <div class="success-message">
                <h2>¡Reserva Confirmada!</h2>
                <p>Su reserva #${reservaConfirmada.id} ha sido confirmada.</p>
                <p>Hemos enviado un correo con los detalles y la factura a ${pasajero.email}.</p>
                
                <div class="invoice-preview">
                    <h3>Factura</h3>
                    <pre>${reservaConfirmada.factura}</pre>
                    <button id="downloadInvoice" class="btn">Descargar Factura</button>
                </div>
                
                <button id="newReservation" class="btn">Hacer Otra Reserva</button>
            </div>
        `;
        
        reservationResult.hidden = false;
        
        // Manejar botones de resultado
        document.getElementById('downloadInvoice').addEventListener('click', () => {
            downloadInvoice(reservaConfirmada.factura, `factura-${reservaConfirmada.id}.txt`);
        });
        
        document.getElementById('newReservation').addEventListener('click', () => {
            location.reload();
        });
    } catch (error) {
        reservationResult.innerHTML = `
            <div class="error-message">
                <h2>Error en la Reserva</h2>
                <p>${error.message}</p>
                <button id="tryAgain" class="btn">Intentar Nuevamente</button>
            </div>
        `;
        
        reservationResult.hidden = false;
        
        document.getElementById('tryAgain').addEventListener('click', () => {
            reservationResult.hidden = true;
            reservationSummary.hidden = false;
        });
    } finally {
        loadingIndicator.hidden = true;
    }
}

async function uploadComprobante(file) {
    // Simular subida de archivo
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`/uploads/${file.name}`);
        }, 1000);
    });
}

function downloadInvoice(content, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Funciones auxiliares para obtener detalles
async function getRutaDetails(id) {
    const response = await fetch(`/api/rutas/${id}`);
    return await response.json();
}

async function getFrecuenciaDetails(id) {
    const response = await fetch(`/api/frecuencias/${id}`);
    return await response.json();
}

async function getVehiculoDetails(id) {
    const response = await fetch(`/api/vehiculos/${id}`);
    return await response.json();
}

// Función para agregar reserva (ahora correctamente exportada)
export const addReservation = async (reservationData) => {
    // Validar datos
    if (!reservationData.fullName || !reservationData.email || !reservationData.travelDate) {
        throw new Error('Por favor complete todos los campos requeridos');
    }
    
    // Formatear fecha
    const date = new Date(reservationData.travelDate);
    if (isNaN(date.getTime())) {
        throw new Error('Fecha inválida');
    }
    
    // Enviar a la API
    return await createReserva({
        ...reservationData,
        travelDate: date.toISOString()
    });
};

// Exportar otras funciones si son necesarias
export const loadUserReservations = async (userEmail) => {
    try {
        const reservations = await getReservations(userEmail);
        return reservations;
    } catch (error) {
        console.error('Error al cargar reservas:', error);
        throw error;
    }
};

// Exportar todas las funciones
export default {
    addReservation,
    loadUserReservations
};