
document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. VARIABLES GLOBALES (MODAL & COPY)
    // =========================================
    const modal = document.getElementById('project-modal');
    const modalImage = document.getElementById('modal-image');
    const closeBtn = document.querySelector('.close-btn');
    
    const viewImageButtons = document.querySelectorAll('.view-image-btn'); 
    const copyCards = document.querySelectorAll('.copy-card');

    const transitionDuration = 400; // Debe coincidir con el 0.4s del CSS

    
    // =========================================
    // 2. FUNCIONES DEL MODAL (OPEN/CLOSE)
    // =========================================

    // Abre el modal con animación
    const openModal = (imageUrl) => {
        modalImage.src = imageUrl; 
        
        modal.style.display = 'block'; 
        
        // Aplica la clase 'open' después de un momento para forzar la transición CSS
        requestAnimationFrame(() => {
            modal.classList.add('open');
        });
    };

    // Cierra el modal con animación
    const closeModal = () => {
        modal.classList.remove('open');
        
        // Oculta el modal DEPUÉS de que la transición haya terminado
        setTimeout(() => {
            modal.style.display = 'none';
        }, transitionDuration); 
    };


    // =========================================
    // 3. LISTENERS DEL MODAL
    // =========================================
    
    // Al hacer clic en el botón 'Ver Imagen'
    viewImageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const imageUrl = button.getAttribute('data-image');
            
            if (imageUrl) {
                // Validación para evitar rutas absolutas de disco (C:\)
                if (imageUrl.startsWith('C:\\') || imageUrl.includes('...')) {
                     console.error('Error: La ruta de la imagen es inválida. Asegúrate de usar rutas RELATIVAS (ej: project-images/mi-proyecto.png).');
                     alert('Error: La ruta de la imagen es de sistema (C:). Por favor, cámbiala a una ruta RELATIVA (ej: project-images/mi-proyecto.png) y recarga la página.');
                } else {
                    openModal(imageUrl); 
                }
            } else {
                console.error('El botón no tiene una ruta de imagen (data-image).');
            }
        });
    });

    // Cerrar el modal al hacer clic en 'x'
    closeBtn.addEventListener('click', closeModal);

    // Cerrar el modal al hacer clic fuera de la imagen (en el fondo)
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Cerrar el modal con la tecla ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });


    // =========================================
    // 4. LISTENERS DE COPIA AL PORTAPAPELES
    // =========================================

    copyCards.forEach(card => {
        card.addEventListener('click', async () => {
            // Usa el atributo data-copy para obtener el texto a copiar
            const textToCopy = card.getAttribute('data-copy');
            const feedbackElement = card.querySelector('.copy-feedback');

            if (!textToCopy) {
                console.error("El atributo 'data-copy' no está definido en la tarjeta.");
                return;
            }

            try {
                // 1. Copiar al portapapeles usando la API moderna
                await navigator.clipboard.writeText(textToCopy);
                
                // 2. Mostrar feedback visual
                feedbackElement.textContent = '¡Copiado!';
                
                // 3. Aplicar clase para animación CSS (deslizamiento)
                card.classList.add('copied');

                // 4. Quitar el feedback y la clase después de un tiempo
                setTimeout(() => {
                    card.classList.remove('copied');
                    feedbackElement.textContent = '';
                }, 1500);

            } catch (err) {
                console.error('Error al intentar copiar el texto:', err);
                // Fallback si la API de Clipboard no está disponible o falla
                alert(`Error al copiar. Por favor, copia manualmente: ${textToCopy}`);
            }
        });
    });
});