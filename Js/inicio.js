// ============================================================
//  INICIO.JS — Comportamiento de la página de inicio
// ============================================================

// Espera a que todo el contenido del DOM esté cargado antes de ejecutar.
document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // CARRUSEL AUTOMÁTICO
    // =====================================================
    // Lista de contenedores de imágenes que deben desplazarse automáticamente.
    const contenedores = [
        ".buffet-img-container",
        ".gym-img-container",
        ".spa-img-container",
        ".zonas-humedas-img-container"
    ];

    contenedores.forEach(selector => {
        const contenedor = document.querySelector(selector);
        if (contenedor) {
            const track = contenedor.querySelector(".carrusel-track");
            const imagenes = track.querySelectorAll("img");
            let indiceActual = 0;
            const gap = 20; // Debe coincidir con el espacio definido en CSS.

            // Calcula cuánto se debe mover el carrusel en cada paso.
            const getSlideOffset = () => {
                const anchoImagen = imagenes[0]?.clientWidth || contenedor.clientWidth;
                return anchoImagen + gap;
            };

            if (imagenes.length > 1) {
                setInterval(() => {
                    // Avanza al siguiente índice y regresa al inicio cuando termina.
                    indiceActual = (indiceActual + 1) % imagenes.length;
                    const offset = getSlideOffset() * indiceActual;
                    // Mueve la pista de imágenes hacia la izquierda.
                    track.style.transform = `translateX(-${offset}px)`;
                }, 4000);
            }
        }
    });

    // =====================================================
    // NAVEGACIÓN SUAVE POR SECCIONES
    // =====================================================
    const botonesMenu = document.querySelectorAll(".btn-menu");

    // Para cada botón del menú, agrega el evento de clic.

    botonesMenu.forEach(boton => {
        boton.addEventListener("click", () => {
            const targetId = boton.getAttribute("data-target");
            const destino = document.getElementById(targetId);
            if (destino) {
                // Calcula la posición del destino considerando el header sticky.
                const headerAltura = document.querySelector("header").offsetHeight;
                const posicion = destino.getBoundingClientRect().top + window.scrollY - headerAltura - 20;
                // Desplaza la ventana suavemente hacia la sección deseada.
                window.scrollTo({ top: posicion, behavior: "smooth" });
            }
        });
    });

    // =====================================================
    // CONTROL DE ACCESO Y VISIBILIDAD DEL PANEL DE ADMIN
    // =====================================================
    async function cargarAdmin() {
        try {
            // Solicita el JSON que contiene los datos del administrador.
            const respuesta = await fetch('Json/index.json');
            const datos = await respuesta.json();
            // Retorna el objeto admin si existe, o null en caso contrario.
            return datos.admin || null;
        } catch (error) {
            console.error('Error al cargar el admin desde JSON:', error);
            return null;
        }
    }

    async function obtenerUsuarioActivo() {
        // Lee el email del usuario activo desde sessionStorage.
        const emailActivo = sessionStorage.getItem('usuario_activo');
        if (!emailActivo) return null;

        // Si el email activo coincide con el admin, retorna el admin.
        const admin = await cargarAdmin();
        if (admin && admin.email === emailActivo) {
            return admin;
        }

        // Si no es admin, busca el usuario en localStorage.
        const usuarios = JSON.parse(localStorage.getItem('usuarios_plataforma') || '[]');
        return usuarios.find(u => u.email === emailActivo) || null;
    }

    async function actualizarVisiblePanelControl() {
        // Obtiene el enlace al panel de control del menú.
        const enlacePanel = document.getElementById('nav-panelcontrol');
        if (!enlacePanel) return;

        const usuario = await obtenerUsuarioActivo();
        if (!usuario || usuario.rol !== 'admin') {
            // Si no es admin activo, oculta el enlace.
            enlacePanel.style.display = 'none';
        } else {
            // Si es admin, muestra el enlace.
            enlacePanel.style.display = '';
        }
    }

    // Botón de cerrar sesión
    const enlaceCerrar = document.getElementById('cerrar-sesion');
    if (enlaceCerrar) {
        enlaceCerrar.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Cerraste sesión correctamente');
            sessionStorage.removeItem('usuario_activo');
            sessionStorage.removeItem('usuario_rol');
            window.location.href = 'index.html';
        });
    }

    actualizarVisiblePanelControl();

});