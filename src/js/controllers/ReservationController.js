import { addReservation as apiAddReservation, getReservations } from '../services/api.js';

export async function addReservation(reservationData) {
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
    return await apiAddReservation({
        ...reservationData,
        travelDate: date.toISOString()
    });
}

export async function loadUserReservations(userEmail) {
    try {
        const reservations = await getReservations(userEmail);
        // Renderizar reservas en la vista
        return reservations;
    } catch (error) {
        console.error('Error al cargar reservas:', error);
        throw error;
    }
}