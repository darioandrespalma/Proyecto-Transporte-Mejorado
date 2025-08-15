import './css/main.css';
import { router } from './js/router.js';

<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', router);
=======
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
>>>>>>> 739dbbe05f5b7b02ebcc0a76f3be2ae1cba03cf8
