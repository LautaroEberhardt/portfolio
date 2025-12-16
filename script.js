document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener los elementos del DOM
    const modal = document.getElementById('project-modal');
    const modalImage = document.getElementById('modal-image');
    const closeBtn = document.querySelector('.close-btn');
    // *** CAMBIO AQUÍ: Ahora seleccionamos SOLO los botones de "Ver Imagen" ***
    const viewImageButtons = document.querySelectorAll('.view-image-btn'); 
    
    const transitionDuration = 400; 

    // Función para abrir el modal con animación
    const openModal = (imageUrl) => {
        modalImage.src = imageUrl; 
        
        modal.style.display = 'block'; 
        
        requestAnimationFrame(() => {
            modal.classList.add('open');
        });
    };

    // Función para cerrar el modal con animación
    const closeModal = () => {
        modal.classList.remove('open');
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, transitionDuration); 
    };


    // 2. Manejar clics en los botones de "Ver Imagen"
    viewImageButtons.forEach(button => {
        // *** CAMBIO AQUÍ: Escuchamos el evento click en el botón ***
        button.addEventListener('click', () => {
            // *** CAMBIO AQUÍ: Obtenemos la ruta del atributo data-image del botón ***
            const imageUrl = button.getAttribute('data-image');
            
            if (imageUrl) {
                // Validación de ruta para evitar problemas con rutas de sistema
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

    // 3. Cerrar el modal al hacer clic en 'x'
    closeBtn.addEventListener('click', closeModal);

    // 4. Cerrar el modal al hacer clic fuera de la imagen (en el fondo)
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // 5. Cerrar el modal con la tecla ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});