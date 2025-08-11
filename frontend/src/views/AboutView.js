export function renderAbout() {
    const main = document.createElement('main');
    main.className = 'about-view';
    
    main.innerHTML = `
        <section class="about-hero">
            <h2>Acerca de Nosotros</h2>
        </section>
        
        <section class="about-content">
            <div class="about-history">
                <h3>Nuestra Historia</h3>
                <p>Transporte Seguro fue fundado en 2010 con la misión de proporcionar soluciones de transporte confiables y seguras para nuestros clientes. Desde entonces, hemos crecido hasta convertirnos en una de las empresas líderes en el sector.</p>
                <p>Nuestro compromiso con la excelencia y la satisfacción del cliente nos ha permitido expandirnos a nivel nacional, manteniendo siempre nuestros altos estándares de calidad.</p>
            </div>
            
            <div class="about-mission">
                <h3>Misión y Visión</h3>
                <p><strong>Misión:</strong> Proporcionar servicios de transporte seguros, confiables y de alta calidad que superen las expectativas de nuestros clientes.</p>
                <p><strong>Visión:</strong> Ser la empresa líder en soluciones de transporte en la región, reconocida por nuestra innovación y compromiso con la excelencia.</p>
            </div>
            
            <div class="about-values">
                <h3>Nuestros Valores</h3>
                <ul>
                    <li><strong>Seguridad:</strong> Priorizamos la seguridad en todos nuestros servicios</li>
                    <li><strong>Confianza:</strong> Construimos relaciones basadas en la confianza</li>
                    <li><strong>Puntualidad:</strong> Respetamos el tiempo de nuestros clientes</li>
                    <li><strong>Innovación:</strong> Buscamos constantemente mejorar nuestros servicios</li>
                    <li><strong>Sostenibilidad:</strong> Nos comprometemos con prácticas ecoamigables</li>
                </ul>
            </div>
            
            <div class="about-team">
                <h3>Nuestro Equipo</h3>
                <div class="team-grid">
                    <div class="team-member">
                        <h4>Carlos Rodríguez</h4>
                        <p>Fundador y CEO</p>
                    </div>
                    <div class="team-member">
                        <h4>Ana Martínez</h4>
                        <p>Directora de Operaciones</p>
                    </div>
                    <div class="team-member">
                        <h4>Jorge Fernández</h4>
                        <p>Jefe de Flota</p>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    return main;
}