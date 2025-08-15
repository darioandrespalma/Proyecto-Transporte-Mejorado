import { getRutas, getFrecuencias, getBuses, getAsientos, createPasajero, createReserva } from '../js/services/api.js';
import { createBusSeatMap } from '../components/BusSeatMap.js';

export async function renderReservations() {
    const main = document.createElement('main');
    main.className = 'reservations-view';
    main.setAttribute('role', 'main');
    
    try {
        const rutas = await getRutas();
        
        main.innerHTML = `
            <section class="reservations-hero" aria-label="Encabezado de reservas">
                <h1>Reserva tu Viaje</h1>
                <p>Completa los datos para reservar tus asientos</p>
            </section>
            
            <div class="reservations-container">
                <!-- Paso 1: Datos del pasajero -->
                <div class="reservation-step" id="step1">
                    <h2>Datos del Pasajero</h2>
                    <form id="passengerForm" class="reservation-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="cedula">Cédula <span aria-label="requerido">*</span></label>
                                <input type="text" id="cedula" name="cedula" required maxlength="10" 
                                       aria-describedby="cedula-error" aria-required="true">
                                <div id="cedula-error" class="error-message" role="alert" aria-live="polite"></div>
                            </div>
                            <div class="form-group">
                                <label for="nombre">Nombre <span aria-label="requerido">*</span></label>
                                <input type="text" id="nombre" name="nombre" required aria-required="true">
                                <div id="nombre-error" class="error-message" role="alert" aria-live="polite"></div>
                            </div>
                            <div class="form-group">
                                <label for="apellido">Apellido <span aria-label="requerido">*</span></label>
                                <input type="text" id="apellido" name="apellido" required aria-required="true">
                                <div id="apellido-error" class="error-message" role="alert" aria-live="polite"></div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="direccion">Dirección</label>
                            <input type="text" id="direccion" name="direccion">
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="celular">Celular <span aria-label="requerido">*</span></label>
                                <input type="tel" id="celular" name="celular" required aria-required="true">
                                <div id="celular-error" class="error-message" role="alert" aria-live="polite"></div>
                            </div>
                            <div class="form-group">
                                <label for="email">Email <span aria-label="requerido">*</span></label>
                                <input type="email" id="email" name="email" required aria-required="true">
                                <div id="email-error" class="error-message" role="alert" aria-live="polite"></div>
                            </div>
                        </div>
                        
                        <button type="button" id="nextToTravel" class="btn next-btn">Siguiente</button>
                    </form>
                </div>
                
                <!-- Paso 2: Datos del viaje -->
                <div class="reservation-step" id="step2" hidden>
                    <h2>Datos del Viaje</h2>
                    <form id="travelForm" class="reservation-form">
                        <div class="form-group">
                            <label for="ruta">Ruta <span aria-label="requerido">*</span></label>
                            <select id="ruta" name="ruta" required aria-required="true">
                                <option value="">Selecciona una ruta</option>
                                ${rutas.map(ruta => `
                                    <option value="${ruta.id}">${ruta.nombre}</option>
                                `).join('')}
                            </select>
                            <div id="ruta-error" class="error-message" role="alert" aria-live="polite"></div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="fechaViaje">Fecha de Viaje <span aria-label="requerido">*</span></label>
                                <input type="date" id="fechaViaje" name="fechaViaje" required 
                                       min="${new Date().toISOString().split('T')[0]}" aria-required="true">
                                <div id="fecha-error" class="error-message" role="alert" aria-live="polite"></div>
                            </div>
                            <div class="form-group">
                                <label for="frecuencia">Frecuencia <span aria-label="requerido">*</span></label>
                                <select id="frecuencia" name="frecuencia" required disabled aria-required="true">
                                    <option value="">Selecciona primero una ruta</option>
                                </select>
                                <div id="frecuencia-error" class="error-message" role="alert" aria-live="polite"></div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="bus">Bus <span aria-label="requerido">*</span></label>
                            <select id="bus" name="bus" required disabled aria-required="true">
                                <option value="">Selecciona primero una frecuencia</option>
                            </select>
                            <div id="bus-error" class="error-message" role="alert" aria-live="polite"></div>
                        </div>
                        
                        <div id="seatSelectionContainer"></div>
                        <div id="asientos-error" class="error-message" role="alert" aria-live="polite"></div>
                        
                        <div class="form-navigation">
                            <button type="button" id="backToPassenger" class="btn back-btn">Anterior</button>
                            <button type="button" id="nextToPayment" class="btn next-btn">Siguiente</button>
                        </div>
                    </form>
                </div>
                
                <!-- Paso 3: Pago -->
                <div class="reservation-step" id="step3" hidden>
                    <h2>Método de Pago</h2>
                    <form id="paymentForm" class="reservation-form">
                        <div class="form-group">
                            <fieldset>
                                <legend>Método de Pago <span aria-label="requerido">*</span></legend>
                                <div class="payment-methods">
                                    <label>
                                        <input type="radio" name="metodo_pago" value="transferencia" required>
                                        Transferencia Bancaria
                                    </label>
                                    <label>
                                        <input type="radio" name="metodo_pago" value="tarjeta" required>
                                        Tarjeta de Crédito/Débito
                                    </label>
                                </div>
                                <div id="metodo-error" class="error-message" role="alert" aria-live="polite"></div>
                            </fieldset>
                        </div>
                        
                        <div id="transferenciaFields" class="payment-fields" hidden>
                            <div class="form-group">
                                <label for="comprobante">Comprobante de Transferencia</label>
                                <input type="file" id="comprobante" name="comprobante" accept="image/*,.pdf">
                                <small>Acepta imágenes y PDF (máx. 5MB)</small>
                            </div>
                        </div>
                        
                        <div id="tarjetaFields" class="payment-fields" hidden>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="numero_tarjeta">Número de Tarjeta <span aria-label="requerido">*</span></label>
                                    <input type="text" id="numero_tarjeta" name="numero_tarjeta" 
                                           placeholder="1234 5678 9012 3456" maxlength="19" required>
                                    <div id="tarjeta-error" class="error-message" role="alert" aria-live="polite"></div>
                                </div>
                                <div class="form-group">
                                    <label for="fecha_vencimiento">Fecha de Vencimiento <span aria-label="requerido">*</span></label>
                                    <input type="text" id="fecha_vencimiento" name="fecha_vencimiento" 
                                           placeholder="MM/YY" maxlength="5" required>
                                    <div id="vencimiento-error" class="error-message" role="alert" aria-live="polite"></div>
                                </div>
                                <div class="form-group">
                                    <label for="cvv">CVV <span aria-label="requerido">*</span></label>
                                    <input type="text" id="cvv" name="cvv" placeholder="123" maxlength="4" required>
                                    <div id="cvv-error" class="error-message" role="alert" aria-live="polite"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-navigation">
                            <button type="button" id="backToTravel" class="btn back-btn">Anterior</button>
                            <button type="button" id="confirmReservation" class="btn submit-btn">Confirmar Reserva</button>
                        </div>
                    </form>
                </div>
                
                <!-- Confirmación -->
                <div class="reservation-step" id="confirmationStep" hidden>
                    <div class="confirmation-content">
                        <h2>¡Reserva Confirmada!</h2>
                        <div id="confirmationDetails"></div>
                        <div class="confirmation-actions">
                            <button id="newReservation" class="btn">Hacer Otra Reserva</button>
                            <button id="downloadInvoice" class="btn secondary-btn">Descargar Factura</button>
                        </div>
                    </div>
                </div>
                
            </div>
        `;
        
        initializeReservationFlow(main);
        
    } catch (error) {
        main.innerHTML = `
            <div class="error-message">
                <h2>Error al cargar el formulario</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
    
    return main;
}




function initializeReservationFlow(main) {
    // Elementos del DOM
    const step1 = main.querySelector('#step1');
    const step2 = main.querySelector('#step2');
    const step3 = main.querySelector('#step3');
    const confirmationStep = main.querySelector('#confirmationStep');
    const loadingIndicator = main.querySelector('#loadingIndicator');
    
    // Paso 1: Datos del pasajero
    const passengerForm = main.querySelector('#passengerForm');
    const nextToTravel = main.querySelector('#nextToTravel');
    
    // Paso 2: Datos del viaje
    const travelForm = main.querySelector('#travelForm');
    const backToPassenger = main.querySelector('#backToPassenger');
    const nextToPayment = main.querySelector('#nextToPayment');
    const rutaSelect = main.querySelector('#ruta');
    const frecuenciaSelect = main.querySelector('#frecuencia');
    const busSelect = main.querySelector('#bus');
    const seatSelectionContainer = main.querySelector('#seatSelectionContainer');
    
    // Paso 3: Pago
    const paymentForm = main.querySelector('#paymentForm');
    const backToTravel = main.querySelector('#backToTravel');
    const confirmReservation = main.querySelector('#confirmReservation');
    const metodoPagoRadios = paymentForm.querySelectorAll('input[name="metodo_pago"]');
    const transferenciaFields = main.querySelector('#transferenciaFields');
    const tarjetaFields = main.querySelector('#tarjetaFields');
    
    // Confirmación
    const newReservation = main.querySelector('#newReservation');
    const downloadInvoice = main.querySelector('#downloadInvoice');
    const confirmationDetails = main.querySelector('#confirmationDetails');
    
    // Variables de estado
    let currentStep = 1;
    let seatMap = null;
    let reservaData = {};
    
    // Validación de cédula ecuatoriana
    function validarCedula(cedula) {
        if (!cedula || cedula.length !== 10) return false;
        
        const digitos = cedula.split('').map(Number);
        const provincia = digitos[0] * 10 + digitos[1];
        
        if (provincia < 1 || provincia > 24) return false;
        
        const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let suma = 0;
        
        for (let i = 0; i < 9; i++) {
            let digito = digitos[i] * coeficientes[i];
            if (digito >= 10) digito -= 9;
            suma += digito;
        }
        
        const verificador = (10 - (suma % 10)) % 10;
        return verificador === digitos[9];
    }
    
    // Validación de formulario de pasajero
    function validarPasajero() {
        const cedula = main.querySelector('#cedula').value.trim();
        const nombre = main.querySelector('#nombre').value.trim();
        const apellido = main.querySelector('#apellido').value.trim();
        const celular = main.querySelector('#celular').value.trim();
        const email = main.querySelector('#email').value.trim();
        
        let isValid = true;
        
        // Validar cédula
        if (!cedula) {
            mostrarError('cedula', 'La cédula es requerida');
            isValid = false;
        } else if (!validarCedula(cedula)) {
            mostrarError('cedula', 'Cédula inválida');
            isValid = false;
        } else {
            mostrarError('cedula', '');
        }
        
        // Validar nombre
        if (!nombre) {
            mostrarError('nombre', 'El nombre es requerido');
            isValid = false;
        } else {
            mostrarError('nombre', '');
        }
        
        // Validar apellido
        if (!apellido) {
            mostrarError('apellido', 'El apellido es requerido');
            isValid = false;
        } else {
            mostrarError('apellido', '');
        }
        
        // Validar celular
        if (!celular) {
            mostrarError('celular', 'El celular es requerido');
            isValid = false;
        } else {
            mostrarError('celular', '');
        }
        
        // Validar email
        if (!email) {
            mostrarError('email', 'El email es requerido');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            mostrarError('email', 'Email inválido');
            isValid = false;
        } else {
            mostrarError('email', '');
        }
        
        // Guardar datos solo si es válido
        if (isValid) {
            reservaData.pasajero = {
                cedula,
                nombre,
                apellido,
                direccion: main.querySelector('#direccion').value.trim(),
                celular,
                email
            };
        }
        
        return isValid;
    }
    
    function mostrarError(campo, mensaje) {
        const errorElement = main.querySelector(`#${campo}-error`);
        if (errorElement) {
            errorElement.textContent = mensaje;
        }
    }
    
    // Navegación entre pasos
    function goToStep(step) {
        step1.hidden = step !== 1;
        step2.hidden = step !== 2;
        step3.hidden = step !== 3;
        confirmationStep.hidden = step !== 4;
        currentStep = step;
        
        // Enfocar el primer elemento al cambiar de paso
        setTimeout(() => {
            if (step === 1) main.querySelector('#cedula')?.focus();
            if (step === 2) main.querySelector('#ruta')?.focus();
            if (step === 3) main.querySelector('input[name="metodo_pago"]')?.focus();
        }, 100);
    }
    
    // Cargar frecuencias cuando se selecciona una ruta
    rutaSelect.addEventListener('change', async (e) => {
        const rutaId = e.target.value;
        frecuenciaSelect.innerHTML = '<option value="">Cargando frecuencias...</option>';
        frecuenciaSelect.disabled = true;
        busSelect.innerHTML = '<option value="">Selecciona primero una frecuencia</option>';
        busSelect.disabled = true;
        seatSelectionContainer.innerHTML = '';
        
        if (!rutaId) return;
        
        try {
            const frecuencias = await getFrecuencias(rutaId);
            frecuenciaSelect.innerHTML = '<option value="">Selecciona una frecuencia</option>';
            
            frecuencias.forEach(frecuencia => {
                const option = document.createElement('option');
                option.value = frecuencia.id;
                option.textContent = `${frecuencia.hora_salida}`;
                frecuenciaSelect.appendChild(option);
            });
            
            frecuenciaSelect.disabled = false;
        } catch (error) {
            console.error('Error:', error);
            mostrarError('ruta', 'Error al cargar frecuencias');
        }
    });
    
        frecuenciaSelect.addEventListener('change', async (e) => {
        const frecuenciaId = e.target.value;
        const rutaId = rutaSelect.value;
        
        busSelect.innerHTML = '<option value="">Cargando buses...</option>';
        busSelect.disabled = true;
        seatSelectionContainer.innerHTML = '';
        
        if (!frecuenciaId || !rutaId) return;
        
        try {
            const buses = await getBuses(rutaId);
            busSelect.innerHTML = '<option value="">Selecciona un bus</option>';
            
            buses.forEach(bus => {
                const option = document.createElement('option');
                option.value = bus.id;
                option.textContent = `Bus #${bus.numero_bus} (${bus.capacidad} asientos)`;
                busSelect.appendChild(option);
            });
            
            busSelect.disabled = false;
        } catch (error) {
            console.error('Error:', error);
            mostrarError('frecuencia', 'Error al cargar buses');
        }
    });













    
// En la función initializeReservationFlow:

busSelect.addEventListener('change', async (e) => {
const busId = e.target.value;
seatSelectionContainer.innerHTML = '';

if (!busId) return;

try {
const asientos = await getAsientos(busId);

// Verificar que los asientos sean válidos
if (!asientos || !Array.isArray(asientos)) {
throw new Error('Datos de asientos no válidos');
}

seatMap = createBusSeatMap(asientos);
seatSelectionContainer.appendChild(seatMap.container);

// Crear contenedor para mostrar asientos seleccionados
const selectedSeatsContainer = document.createElement('div');
selectedSeatsContainer.id = 'asientos-seleccionados';
seatSelectionContainer.appendChild(selectedSeatsContainer);

} catch (error) {
console.error('Error al cargar asientos:', error);
mostrarError('bus', 'Error al cargar los asientos del bus');
seatSelectionContainer.innerHTML = `
<p class="error-message">Error al cargar asientos: ${error.message}</p>
`;
}
});

















// Manejar métodos de pago
metodoPagoRadios.forEach(radio => {
radio.addEventListener('change', (e) => {
transferenciaFields.hidden = e.target.value !== 'transferencia';
tarjetaFields.hidden = e.target.value !== 'tarjeta';
});
});

// Formatear número de tarjeta
const numeroTarjeta = main.querySelector('#numero_tarjeta');
numeroTarjeta?.addEventListener('input', (e) => {
let value = e.target.value.replace(/\D/g, '');
if (value.length > 16) value = value.substring(0, 16);

let formatted = '';
for (let i = 0; i < value.length; i++) {
if (i > 0 && i % 4 === 0) formatted += ' ';
formatted += value[i];
}

e.target.value = formatted;
});

// Formatear fecha de vencimiento
const fechaVencimiento = main.querySelector('#fecha_vencimiento');
fechaVencimiento?.addEventListener('input', (e) => {
let value = e.target.value.replace(/\D/g, '');
if (value.length > 4) value = value.substring(0, 4);

if (value.length >= 2) {
value = value.substring(0, 2) + '/' + value.substring(2);
}

e.target.value = value;
});

// Validar CVV
const cvv = main.querySelector('#cvv');
cvv?.addEventListener('input', (e) => {
e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
});

// Event listeners de navegación
nextToTravel.addEventListener('click', () => {
if (validarPasajero()) {
goToStep(2);
        }
    });
    
    backToPassenger.addEventListener('click', () => {
        goToStep(1);
    });
    
    nextToPayment.addEventListener('click', () => {
        const rutaId = rutaSelect.value;
        const frecuenciaId = frecuenciaSelect.value;
        const busId = busSelect.value;
        const fechaViaje = main.querySelector('#fechaViaje').value;
        
        let isValid = true;
        
        if (!rutaId) {
            mostrarError('ruta', 'Selecciona una ruta');
            isValid = false;
        }
        
        if (!frecuenciaId) {
            mostrarError('frecuencia', 'Selecciona una frecuencia');
            isValid = false;
        }
        
        if (!busId) {
            mostrarError('bus', 'Selecciona un bus');
            isValid = false;
        }
        
        if (!fechaViaje) {
            mostrarError('fecha', 'Selecciona una fecha');
            isValid = false;
        }
        
        if (!seatMap || seatMap.getSelectedSeats().length === 0) {
            mostrarError('asientos', 'Selecciona al menos un asiento');
            isValid = false;
        }
        
        if (isValid) {
            // Guardar datos del viaje
            reservaData.viaje = {
                ruta_id: rutaId,
                frecuencia_id: frecuenciaId,
                bus_id: busId,
                fecha_viaje: fechaViaje,
                asientos: seatMap.getSelectedSeats()
            };
            
            goToStep(3);
        }
    });
    
    backToTravel.addEventListener('click', () => {
        goToStep(2);
    });
    
    // Confirmar reserva
    confirmReservation.addEventListener('click', async () => {
        const metodoPago = paymentForm.querySelector('input[name="metodo_pago"]:checked');
        if (!metodoPago) {
            mostrarError('metodo', 'Selecciona un método de pago');
            return;
        }
        
        // Validar datos de pago según el método
        if (metodoPago.value === 'tarjeta') {
            const numeroTarjeta = main.querySelector('#numero_tarjeta').value.trim();
            const fechaVencimiento = main.querySelector('#fecha_vencimiento').value.trim();
            const cvv = main.querySelector('#cvv').value.trim();
            
            let isValid = true;
            
            if (!numeroTarjeta || numeroTarjeta.replace(/\s/g, '').length !== 16) {
                mostrarError('tarjeta', 'Número de tarjeta inválido');
                isValid = false;
            }
            
            if (!fechaVencimiento || fechaVencimiento.length !== 5) {
                mostrarError('vencimiento', 'Fecha de vencimiento inválida');
                isValid = false;
            }
            
            if (!cvv || cvv.length < 3) {
                mostrarError('cvv', 'CVV inválido');
                isValid = false;
            }
            
            if (!isValid) return;
        }
        
        // Mostrar loading sin texto
        loadingIndicator.hidden = false;
        
        try {
            // 1. Registrar pasajero
            const pasajero = await createPasajero(reservaData.pasajero);
            
            // 2. Crear reserva
            const reservaRequest = {
                pasajeroId: pasajero.id,
                busId: reservaData.viaje.bus_id,
                frecuenciaId: reservaData.viaje.frecuencia_id,
                fechaViaje: reservaData.viaje.fecha_viaje,
                asientos: reservaData.viaje.asientos.map(a => a.id),
                metodoPago: metodoPago.value
            };
            
            // Agregar comprobante si es transferencia
            if (metodoPago.value === 'transferencia') {
                const comprobante = main.querySelector('#comprobante').files[0];
                if (comprobante) {
                    reservaRequest.comprobante = comprobante.name; // Simulación
                }
            }
            
            const reserva = await createReserva(reservaRequest);
            
            // 3. Mostrar confirmación
            mostrarConfirmacion(reserva, pasajero);
            
            goToStep(4);
            
        } catch (err) {
            console.error('Error:', err);
            alert(`Error al procesar la reserva: ${err.message}`);
        } finally {
            loadingIndicator.hidden = true;
        }
    });
    
    // Nueva reserva
    newReservation.addEventListener('click', () => {
        // Limpiar datos
        reservaData = {};
        if (seatMap) {
            seatMap.clearSelection();
        }
        
        // Resetear formularios
        passengerForm.reset();
        travelForm.reset();
        paymentForm.reset();
        
        // Resetear selects
        frecuenciaSelect.innerHTML = '<option value="">Selecciona primero una ruta</option>';
        frecuenciaSelect.disabled = true;
        busSelect.innerHTML = '<option value="">Selecciona primero una frecuencia</option>';
        busSelect.disabled = true;
        
        // Ocultar campos de pago
        transferenciaFields.hidden = true;
        tarjetaFields.hidden = true;
        
        // Volver al primer paso
        goToStep(1);
    });
    
    // Descargar factura
    downloadInvoice.addEventListener('click', () => {
        // Simular descarga de factura
        const facturaContent = generarFacturaSimulada();
        const blob = new Blob([facturaContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'factura-reserva.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    function mostrarConfirmacion(reserva, pasajero) {
        const asientosCount = reservaData.viaje.asientos.length;
        const total = asientosCount * 15;
        
        confirmationDetails.innerHTML = `
            <div class="confirmation-summary">
                <h3>Detalles de la Reserva</h3>
                <p><strong>Número de Reserva:</strong> ${reserva.id}</p>
                <p><strong>Pasajero:</strong> ${pasajero.nombre} ${pasajero.apellido}</p>
                <p><strong>Cédula:</strong> ${pasajero.cedula}</p>
                <p><strong>Email:</strong> ${pasajero.email}</p>
                <p><strong>Fecha de Reserva:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Total Pagado:</strong> $${total.toFixed(2)}</p>
                <p><strong>Método de Pago:</strong> ${reserva.metodo_pago === 'transferencia' ? 'Transferencia Bancaria' : 'Tarjeta'}</p>
            </div>
            
            <div class="confirmation-seats">
                <h3>Asientos Reservados</h3>
                <ul>
                    ${reservaData.viaje.asientos.map(asiento => `
                        <li>Asiento ${asiento.numero_asiento} (${asiento.ubicacion.replace('_', ' ')})</li>
                    `).join('')}
                </ul>
                <p><strong>Total:</strong> ${asientosCount} asiento(s)</p>
            </div>
        `;
    }
    
    function generarFacturaSimulada() {
        const asientosCount = reservaData.viaje.asientos.length;
        const total = asientosCount * 15;
        
        return `
FACTURA DE RESERVA
=================

Número de Reserva: ${Date.now()}
Fecha: ${new Date().toLocaleDateString()}

DATOS DEL PASAJERO:
Nombre: ${reservaData.pasajero?.nombre || ''} ${reservaData.pasajero?.apellido || ''}
Cédula: ${reservaData.pasajero?.cedula || ''}
Email: ${reservaData.pasajero?.email || ''}

DETALLE DE SERVICIO:
Reserva de asientos de bus
Cantidad: ${asientosCount} asiento(s)
Precio unitario: $15.00
Subtotal: $${total.toFixed(2)}

TOTAL A PAGAR: $${total.toFixed(2)}

MÉTODO DE PAGO: ${paymentForm.querySelector('input[name="metodo_pago"]:checked')?.value === 'transferencia' ? 'Transferencia Bancaria' : 'Tarjeta'}

Gracias por su preferencia.
Cooperativa de Transporte Interprovincial
        `;
    }
}