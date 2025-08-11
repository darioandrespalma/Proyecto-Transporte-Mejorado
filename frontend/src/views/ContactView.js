export function renderContact() {
    const main = document.createElement('main');
    main.className = 'contact-view';
    
    main.innerHTML = `
        <section class="contact-hero">
            <h2>Contáctanos</h2>
            <p>Estamos aquí para ayudarte con cualquier pregunta o solicitud</p>
        </section>
        
        <div class="contact-container">
            <div class="contact-info">
                <h3>Información de Contacto</h3>
                <p><strong>Dirección:</strong> Av. Principal 123, Ciudad</p>
                <p><strong>Teléfono:</strong> +1 234 567 890</p>
                <p><strong>Email:</strong> contacto@transporteseguro.com</p>
                <p><strong>Horario:</strong> Lunes a Viernes: 8am - 6pm</p>
                
                <div class="map-container">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d-75.57170598468198!3d6.211448595553827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e468276c7e4a1e9%3A0x2aef0e2e3f7d5d7d!2sPlaza%20Botero!5e0!3m2!1ses!2sco!4v1630000000000!5m2!1ses!2sco" 
                        width="100%" 
                        height="300" 
                        style="border:0;" 
                        allowfullscreen="" 
                        loading="lazy">
                    </iframe>
                </div>
            </div>
            
            <div class="contact-form-container">
                <h3>Envíanos un Mensaje</h3>
                <form id="contactForm">
                    <div class="form-group">
                        <label for="name">Nombre</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="contactEmail">Email</label>
                        <input type="email" id="contactEmail" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="subject">Asunto</label>
                        <input type="text" id="subject" name="subject" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="message">Mensaje</label>
                        <textarea id="message" name="message" rows="5" required></textarea>
                    </div>
                    
                    <button type="submit" class="btn submit-btn">Enviar Mensaje</button>
                </form>
            </div>
        </div>
    `;
    
    return main;
}