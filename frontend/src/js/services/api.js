const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

<<<<<<< HEAD
=======
export const getBusesDestacados = async () => {
  try {
    const url = `${API_URL}/api/buses/destacados`;
    console.log('Fetching buses from:', url); // Agrega esta línea para verificar la URL
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener buses destacados');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener buses destacados:', error);
    throw error;
  }
};
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
export const getRutas = async () => {
  try {
    const response = await fetch(`${API_URL}/api/rutas`);
    if (!response.ok) throw new Error('Error al obtener rutas');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    throw error;
  }
};

// Agregar esta función
export const getBuses = async (rutaId) => {
  try {
<<<<<<< HEAD
    const response = await fetch(`${API_URL}/api/buses/ruta/${rutaId}`);
=======
    const response = await fetch(`${API_URL}/api/buses/${rutaId}`);
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
    if (!response.ok) throw new Error('Error al obtener buses');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener buses:', error);
    throw error;
  }
};
<<<<<<< HEAD

export const getFrecuencias = async (rutaId) => {
  try {
    const response = await fetch(`${API_URL}/api/rutas/${rutaId}/frecuencias`);
=======
export const getFrecuencias = async (rutaId) => {
  try {
    const response = await fetch(`${API_URL}/api/frecuencias/${rutaId}`);
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
    if (!response.ok) throw new Error('Error al obtener frecuencias');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener frecuencias:', error);
    throw error;
  }
};


<<<<<<< HEAD

export const getAsientos = async (busId) => {
  try {
    const response = await fetch(`${API_URL}/api/asientos/bus/${busId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener asientos');
    }
    
    const data = await response.json();
    
    // Validar estructura de los datos
    if (!Array.isArray(data)) {
      throw new Error('Formato de datos inválido: se esperaba un array');
    }
    
    // Validar estructura básica de cada asiento
    data.forEach(asiento => {
      if (!asiento.id || !asiento.numero_asiento || !asiento.ubicacion) {
        console.warn('Asiento con estructura incompleta:', asiento);
        throw new Error('Estructura de asiento inválida');
      }
      
      // Asegurar que tenga propiedad fila
      if (!asiento.fila) {
        asiento.fila = '0'; // Valor por defecto
      }
    });
    
    return data;
=======
export const getAsientos = async (vehiculoId) => {
  try {
    const response = await fetch(`${API_URL}/api/asientos/${vehiculoId}`);
    if (!response.ok) throw new Error('Error al obtener asientos');
    return await response.json();
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
  } catch (error) {
    console.error('Error al obtener asientos:', error);
    throw error;
  }
};

export const createPasajero = async (pasajeroData) => {
  try {
    const response = await fetch(`${API_URL}/api/pasajeros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pasajeroData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al registrar pasajero');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al registrar pasajero:', error);
    throw error;
  }
};

export const createReserva = async (reservaData) => {
  try {
    const response = await fetch(`${API_URL}/api/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservaData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear reserva');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al crear reserva:', error);
    throw error;
  }
};

export const confirmarReserva = async (reservaId) => {
  try {
    const response = await fetch(`${API_URL}/api/reservas/${reservaId}/confirmar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al confirmar reserva');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al confirmar reserva:', error);
    throw error;
  }
};

export const uploadComprobante = async (reservaId, file) => {
  try {
    const formData = new FormData();
    formData.append('comprobante', file);
    
    const response = await fetch(`${API_URL}/api/reservas/${reservaId}/comprobante`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al subir comprobante');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al subir comprobante:', error);
    throw error;
  }
};