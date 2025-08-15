export function createReservationForm() {
    const form = document.createElement('form');
    form.className = 'reservation-form';
    form.id = 'reservationForm';
    form.setAttribute('aria-label', 'Formulario de reserva de pasajes');
    
    form.innerHTML = `
        <fieldset>
            <legend>Datos Personales</legend>
            
            <div class="form-group">
                <label for="cedula">Número de Cédula</label>
                <input type="text" id="cedula" name="cedula" required 
                       aria-required="true" pattern="[0-9]{10}" 
                       title="Ingrese un número de cédula válido (10 dígitos)">
                <span class="error-message" id="cedula-error" aria-live="polite"></span>
            </div>
            
            <div class="form-group">
                <label for="nombre">Nombres</label>
                <input type="text" id="nombre" name="nombre" required aria-required="true">
            </div>
            
            <div class="form-group">
                <label for="apellido">Apellidos</label>
                <input type="text" id="apellido" name="apellido" required aria-required="true">
            </div>
            
            <div class="form-group">
                <label for="direccion">Dirección</label>
                <input type="text" id="direccion" name="direccion">
            </div>
            
            <div class="form-group">
                <label for="telefono">Teléfono/Celular</label>
                <input type="tel" id="telefono" name="telefono" required aria-required="true">
            </div>
            
            <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input type="email" id="email" name="email" required aria-required="true">
            </div>
        </fieldset>
        
        <fieldset>
            <legend>Datos del Viaje</legend>
            
            <div class="form-group">
                <label for="ruta">Ruta</label>
                <select id="ruta" name="ruta" required aria-required="true">
                    <option value="">Seleccione una ruta...</option>
                    <!-- Opciones se llenarán dinámicamente -->
                </select>
            </div>
            
            <div class="form-group">
                <label for="frecuencia">Fecha y Hora de Salida</label>
                <select id="frecuencia" name="frecuencia" required aria-required="true" disabled>
                    <option value="">Primero seleccione una ruta</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="vehiculo">Bus</label>
                <select id="vehiculo" name="vehiculo" required aria-required="true" disabled>
                    <option value="">Primero seleccione una frecuencia</option>
                </select>
            </div>
        </fieldset>
        
        <fieldset>
            <legend>Selección de Asientos</legend>
            <div id="asientos-container">
                <p>Primero seleccione un bus para ver los asientos disponibles</p>
            </div>
            <div id="asientos-seleccionados" aria-live="polite"></div>
        </fieldset>
        
        <fieldset>
            <legend>Método de Pago</legend>
            
            <div class="payment-methods">
                <div class="payment-option">
                    <input type="radio" id="transferencia" name="metodo_pago" value="transferencia" required aria-required="true">
                    <label for="transferencia">Transferencia Bancaria</label>
                    
                    <div id="transferencia-fields" class="payment-fields" hidden>
                        <div class="form-group">
                            <label for="comprobante">Subir Comprobante</label>
                            <input type="file" id="comprobante" name="comprobante" accept="image/*,.pdf">
                        </div>
                    </div>
                </div>
                
                <div class="payment-option">
                    <input type="radio" id="tarjeta" name="metodo_pago" value="tarjeta">
                    <label for="tarjeta">Tarjeta de Crédito/Débito</label>
                    
                    <div id="tarjeta-fields" class="payment-fields" hidden>
                        <div class="form-group">
                            <label for="numero_tarjeta">Número de Tarjeta</label>
                            <input type="text" id="numero_tarjeta" name="numero_tarjeta" pattern="[0-9]{16}" placeholder="1234 5678 9012 3456">
                        </div>
                        
                        <div class="form-group">
                            <label for="nombre_tarjeta">Nombre en la Tarjeta</label>
                            <input type="text" id="nombre_tarjeta" name="nombre_tarjeta">
                        </div>
                        
                        <div class="form-group-row">
                            <div class="form-group">
                                <label for="expiracion_tarjeta">Fecha de Expiración</label>
                                <input type="text" id="expiracion_tarjeta" name="expiracion_tarjeta" placeholder="MM/AA">
                            </div>
                            
                            <div class="form-group">
                                <label for="cvv_tarjeta">CVV</label>
                                <input type="text" id="cvv_tarjeta" name="cvv_tarjeta" pattern="[0-9]{3,4}" placeholder="123">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
        
        <div class="form-actions">
            <button type="submit" class="btn submit-btn">Confirmar Reserva</button>
        </div>
    `;
    
    return form;
}