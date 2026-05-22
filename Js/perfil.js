// ============================================================
//  PERFIL.JS — Mostrar datos del perfil y reservas del usuario
// ============================================================

// Cargar el usuario administrador desde Json/index.json.
async function cargarAdmin() {
    try {
        const respuesta = await fetch('Json/index.json');
        const datos = await respuesta.json();
        return datos.admin || null;
    } catch (error) {
        console.error('Error al cargar el admin desde JSON:', error);
        return null;
    }
}

// Cargar la lista de usuarios normales guardada en localStorage.
function cargarUsuariosLocal() {
    const datos = localStorage.getItem('usuarios_plataforma');
    return datos ? JSON.parse(datos) : [];
}

// Obtener el usuario activo que inició sesión en sessionStorage.
async function obtenerUsuarioActivo() {
    const emailActivo = sessionStorage.getItem('usuario_activo');
    if (!emailActivo) return null;

    const admin = await cargarAdmin();
    if (admin && admin.email === emailActivo) return admin;

    const usuarios = cargarUsuariosLocal();
    return usuarios.find(u => u.email === emailActivo) || null;
}

// Diccionario para convertir el slug de la habitación a un nombre legible.
const NOMBRES_HABITACION = {
    'suite-presidencial':  'Suite Presidencial',
    'suite-junior':        'Suite Junior',
    'doble-deluxe':        'Doble Deluxe',
    'familiar-superior':   'Familiar Superior',
    'individual-ejecutiva':'Individual Ejecutiva',
};

function formatearNombre(slug) {
    return NOMBRES_HABITACION[slug] || slug;
}

// Renderizar las tarjetas de reserva del usuario activo.
function renderizarReservas(emailUsuario) {
    const lista = document.getElementById('lista-mis-reservas');
    const todasReservas = JSON.parse(localStorage.getItem('reservas_hotel')) || [];
    const misReservas = todasReservas.filter(r => r.email === emailUsuario);

    if (misReservas.length === 0) {
        lista.innerHTML = `
            <div class="reserva-vacia">
                <span class="reserva-vacia-icono"></span>
                <p>No tienes reservas activas en este momento.</p>
            </div>
        `;
        return;
    }

    lista.innerHTML = '';

    misReservas.forEach(reserva => {
        const card = document.createElement('div');
        card.className = 'reserva-card';
        card.dataset.id = reserva.id;

        card.innerHTML = `
            <div class="reserva-card__header">
                <span class="reserva-hab-nombre">${formatearNombre(reserva.habitacion)}</span>
                <span class="reserva-badge">Activa</span>
            </div>
            <div class="reserva-card__body">
                <div class="reserva-dato">
                    <span class="reserva-icono">👤</span>
                    <div>
                        <span class="reserva-label">Titular</span>
                        <span class="reserva-valor">${reserva.nombre}</span>
                    </div>
                </div>
                <div class="reserva-dato">
                    <span class="reserva-icono">👥</span>
                    <div>
                        <span class="reserva-label">Huéspedes</span>
                        <span class="reserva-valor">${reserva.huespedes}</span>
                    </div>
                </div>
                <div class="reserva-dato">
                    <span class="reserva-icono">📅</span>
                    <div>
                        <span class="reserva-label">Check-in</span>
                        <span class="reserva-valor">${reserva.checkin}</span>
                    </div>
                </div>
                <div class="reserva-dato">
                    <span class="reserva-icono">📅</span>
                    <div>
                        <span class="reserva-label">Check-out</span>
                        <span class="reserva-valor">${reserva.checkout}</span>
                    </div>
                </div>
                ${reserva.peticiones ? `
                <div class="reserva-dato reserva-dato--full">
                    <span class="reserva-icono">📝</span>
                    <div>
                        <span class="reserva-label">Peticiones especiales</span>
                        <span class="reserva-valor">${reserva.peticiones}</span>
                    </div>
                </div>` : ''}
            </div>
        `;

        lista.appendChild(card);
    });
}

// Cargar los datos del perfil y ajustar lo que se muestra según el rol.
async function renderizarPerfil() {
    const usuario = await obtenerUsuarioActivo();

    if (!usuario) {
        alert('No hay sesión activa. Redirigiendo al login...');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('perfil-nombres').textContent = usuario.nombres;
    document.getElementById('perfil-email').textContent = usuario.email;

    const rol = usuario.rol || 'usuario';
    const badge = document.getElementById('perfil-rol-badge');
    badge.textContent = rol === 'admin' ? 'Administrador' : 'Usuario';
    if (rol === 'admin') badge.classList.add('admin');
    document.getElementById('perfil-rol-texto').textContent =
        rol === 'admin' ? 'Administrador de la plataforma' : 'Usuario estándar';

    if (rol === 'admin') {
        document.getElementById('fila-identificacion').style.display = 'none';
        document.getElementById('fila-telefono').style.display       = 'none';
        document.getElementById('fila-nacionalidad').style.display   = 'none';
        document.getElementById('seccion-mis-reservas').style.display = 'none';
    } else {
        document.getElementById('perfil-identificacion').textContent = usuario.identificacion || '—';
        document.getElementById('perfil-telefono').textContent       = usuario.telefono       || '—';
        document.getElementById('perfil-nacionalidad').textContent   = usuario.nacionalidad   || '—';
        renderizarReservas(usuario.email);
    }
}

document.addEventListener('DOMContentLoaded', renderizarPerfil);