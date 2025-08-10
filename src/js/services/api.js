const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getVehiculos = async () => {
  try {
    const response = await fetch(`${API_URL}/api/vehiculos`);
    if (!response.ok) throw new Error('Error en la respuesta del servidor');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    throw error;
  }
};

export const getReservations = async (email) => {
  try {
    const response = await fetch(`${API_URL}/api/reservas?email=${encodeURIComponent(email)}`);
    if (!response.ok) throw new Error('Error al obtener reservas');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    throw error;
  }
};

export const addReservation = async (reservation) => {
  try {
    const response = await fetch(`${API_URL}/api/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al agregar reserva');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al agregar reserva:', error);
    throw error;
  }
};