<<<<<<< HEAD
export function createBusSeatMap(asientos) {
    // Validación inicial
    if (!Array.isArray(asientos)) {
        console.error('Los asientos deben ser un array', asientos);
        throw new Error('Datos de asientos no válidos');
    }

    const container = document.createElement('div');
    container.className = 'bus-seat-map';
    
    // Caso sin asientos
    if (asientos.length === 0) {
        container.innerHTML = '<p class="no-seats">No hay asientos disponibles para este bus</p>';
        return {
            container,
            getSelectedSeats: () => [],
            clearSelection: () => {},
            render: () => container
        };
    }
    
    // Crear el layout del bus
    const busLayout = document.createElement('div');
    busLayout.className = 'bus-layout';
    
    // Agrupar asientos por fila
    const filas = {};
    asientos.forEach(asiento => {
        if (!asiento.fila) {
            console.warn('Asiento sin propiedad fila:', asiento);
            asiento.fila = '0'; // Valor por defecto
        }
        
=======
export function createBusSeatMap(busId, asientos) {
    const container = document.createElement('div');
    container.className = 'bus-seat-map';
    
    // Agrupar asientos por fila
    const filas = {};
    asientos.forEach(asiento => {
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
        if (!filas[asiento.fila]) {
            filas[asiento.fila] = [];
        }
        filas[asiento.fila].push(asiento);
    });
    
<<<<<<< HEAD
=======
    // Crear visualización de asientos
    const busLayout = document.createElement('div');
    busLayout.className = 'bus-layout';
    
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
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
            const order = { 'ventana_izq': 0, 'pasillo_izq': 1, 'pasillo_der': 2, 'ventana_der': 3 };
            return order[a.ubicacion] - order[b.ubicacion];
        }).forEach(asiento => {
            const asientoElement = document.createElement('button');
            asientoElement.className = `asiento ${asiento.ocupado ? 'ocupado' : 'disponible'}`;
            asientoElement.dataset.id = asiento.id;
            asientoElement.dataset.numero = asiento.numero_asiento;
            asientoElement.dataset.ubicacion = asiento.ubicacion;
            asientoElement.disabled = asiento.ocupado;
            
            asientoElement.innerHTML = `
                <span class="numero">${asiento.numero_asiento}</span>
            `;
            
            if (!asiento.ocupado) {
                asientoElement.addEventListener('click', () => {
                    asientoElement.classList.toggle('selected');
                    updateSelectedSeats();
                });
            }
            
            fila.appendChild(asientoElement);
        });
        
        busLayout.appendChild(fila);
    });
    
    container.appendChild(busLayout);
    
    // Función para obtener asientos seleccionados
    const getSelectedSeats = () => {
        return Array.from(container.querySelectorAll('.asiento.selected'))
            .map(seat => ({
                id: parseInt(seat.dataset.id),
                numero_asiento: seat.dataset.numero,
                ubicacion: seat.dataset.ubicacion
            }));
    };
    
    // Función para limpiar selección
    const clearSelection = () => {
        container.querySelectorAll('.asiento.selected').forEach(seat => {
            seat.classList.remove('selected');
        });
        updateSelectedSeats();
    };
    
    // Actualizar asientos seleccionados
    const updateSelectedSeats = () => {
        const selectedSeats = getSelectedSeats();
        const selectedSeatsContainer = document.getElementById('asientos-seleccionados');
        
<<<<<<< HEAD
        if (selectedSeatsContainer) {
            if (selectedSeats.length > 0) {
                selectedSeatsContainer.innerHTML = `
                    <p>Asientos seleccionados: ${selectedSeats
                        .map(seat => seat.numero_asiento)
                        .join(', ')}</p>
                `;
            } else {
                selectedSeatsContainer.innerHTML = '';
            }
=======
        if (selectedSeats.length > 0) {
            selectedSeatsContainer.innerHTML = `
                <p>Asientos seleccionados: ${selectedSeats
                    .map(seat => seat.numero_asiento)
                    .join(', ')}</p>
            `;
        } else {
            selectedSeatsContainer.innerHTML = '';
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
        }
    };
    
    return {
        container,
        getSelectedSeats,
<<<<<<< HEAD
        clearSelection,
        render: () => container
=======
        clearSelection
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
    };
}