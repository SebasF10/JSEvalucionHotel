// ============================================================
//  HABITACIONES.JS — Mostrar datos de una habitación individual
// ============================================================

// Clave para leer/escribir las habitaciones en localStorage.
const STORAGE_KEY = 'habitaciones';
// Ruta del archivo JSON inicial con los datos de las habitaciones.
const JSON_PATH   = 'Json/habitaciones.json';

// Obtener datos de habitaciones desde localStorage si existen.
// Si no están guardados, carga el JSON inicial y lo guarda localmente.
async function obtenerDatos() {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
        // Si los datos ya están en localStorage, devuélvelos parseados.
        return JSON.parse(guardado);
    }
    // Si no hay datos guardados, los carga desde el JSON inicial.
    const respuesta = await fetch(JSON_PATH);
    const datos = await respuesta.json();
    // Guarda los datos en localStorage para la próxima vez.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    return datos;
}

// Carga la información de la habitación seleccionada y la muestra en la página.
async function cargarHabitacion(id) {
    try {
        // Carga todos los datos de habitaciones.
        const datos = await obtenerDatos();
        // Busca la habitación con el id solicitado.
        const habitacion = datos.habitaciones.find(h => h.id === id);

        if (!habitacion) {
            // Si no encuentra la habitación, muestra un error en consola.
            console.error('Habitación no encontrada. ID:', id);
            return;
        }

        // Escribe cada dato de la habitación en su elemento correspondiente.
        setTexto('habitacion-nombre',        habitacion.nombre);
        setTexto('habitacion-ubicacion',     `Ubicación: ${habitacion.ubicacion}`);
        setTexto('habitacion-descripcion',   habitacion.descripcion);
        setTexto('habitacion-numero',        `Habitación #${habitacion.habitacion_numero}`);
        setTexto('habitacion-area',          `${habitacion.area_m2} m²`);
        setTexto('habitacion-camas',         habitacion.camas);
        setTexto('habitacion-personas',      habitacion.max_personas);
        setTexto('habitacion-precio',        `$${habitacion.precio_por_noche.toLocaleString('es-CO')}`);

        const dispEl = document.getElementById('habitacion-disponibilidad');
        if (dispEl) {
            // Muestra disponibilidad y cambia color según el estado.
            dispEl.textContent = habitacion.disponibilidad ? '✓ Disponible' : '✗ No disponible';
            dispEl.style.color = habitacion.disponibilidad ? '#8ed06a' : '#e08080';
        }

        // Llena las listas de servicios de habitación y de hotel.
        rellenarLista('servicios-habitacion', habitacion.servicios);
        rellenarLista('servicios-hotel', habitacion.servicios_hotel);
        setTexto('contacto-reserva', habitacion.contacto_reserva);


    } catch (error) {
        // Si existe un error en la carga, lo imprime en consola.
        console.error('Error al cargar la habitación:', error);
    }
}

// Escribe texto en un elemento si existe.
function setTexto(id, valor) {
    const el = document.getElementById(id);
    // Si el elemento existe, coloca el texto. Si no existe, no hace nada.
    if (el) el.textContent = valor ?? '';
}

// Construye la lista de servicios en el HTML.
function rellenarLista(id, items) {
    const ul = document.getElementById(id);
    if (!ul) return;
    ul.innerHTML = '';
    // Crea un elemento <li> por cada servicio y lo agrega a la lista.
    (items || []).forEach(texto => {
        const li = document.createElement('li');
        li.textContent = '✓ ' + texto;
        ul.appendChild(li);
    });
}

// Detecta qué habitación mostrar: primero busca un atributo en <body>, luego el parámetro ?id.
function obtenerIdHabitacion() {
    const fromBody = parseInt(document.body.dataset.habitacionId, 10);
    if (Number.isInteger(fromBody) && fromBody >= 1) return fromBody;

    const params = new URLSearchParams(window.location.search);
    const fromUrl = parseInt(params.get('id'), 10);
    if (Number.isInteger(fromUrl) && fromUrl >= 1) return fromUrl;

    // Si no encuentra un ID válido, devuelve 1 por defecto.
    return 1;
}

document.addEventListener('DOMContentLoaded', () => {
    cargarHabitacion(obtenerIdHabitacion());
});