import './css/main.css';
import { router } from './js/router.js';

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    router();

    // Asegúrate de que esta línea esté bien escrita
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
});