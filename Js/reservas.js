// ============================================================
//  RESERVAS.JS — Crear una nueva reserva y guardarla en localStorage
// ============================================================

// Espera a que la página cargue completamente para usar el DOM.
document.addEventListener("DOMContentLoaded", () => {
    // Selecciona el formulario de reserva para leer sus campos.
    const formulario = document.querySelector(".formulario-reserva");

    // VALIDA QUE EL CORREO TENGA UN FORMATO CORRECTO.
    function validarEmailReserva(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // VALIDA QUE EL NÚMERO DE HUÉSPEDES SEA UN NÚMERO ENTERO ENTRE 1 Y 5.
    function validarNumeroHuespedes(valor) {
        const cantidad = Number(valor);
        return Number.isInteger(cantidad) && cantidad >= 1 && cantidad <= 5;
    }

    // Escucha el envío del formulario de reserva.
    formulario.addEventListener("submit", (e) => {
        // Evita que el formulario recargue la página.
        e.preventDefault();

        // Captura los valores ingresados por el usuario.
        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const habitacion = document.getElementById("habitacion").value;
        const huespedes = document.getElementById("huespedes").value.trim();
        const peticiones = document.getElementById("peticiones").value.trim();
        const checkinValor = document.getElementById("checkin").value;
        const checkoutValor = document.getElementById("checkout").value;

        // VALIDACIONES: comprueba campos obligatorios.
        if (!nombre || !email || !habitacion || !huespedes || !checkinValor || !checkoutValor) {
            alert("VALIDACIONES: Completa todos los campos obligatorios antes de reservar.");
            return;
        }

        // VALIDACIONES: usa la función para verificar el formato del email.
        if (!validarEmailReserva(email)) {
            alert("VALIDACIONES: El correo electrónico ingresado no es válido.");
            return;
        }

        // VALIDACIONES: verifica que el número de huéspedes sea válido.
        if (!validarNumeroHuespedes(huespedes)) {
            alert("VALIDACIONES: Ingresa un número de huéspedes válido (1-99). No se admiten caracteres especiales.");
            return;
        }

        // Convierte fechas a objetos Date para poder comparar fechas.
        const checkinNueva = new Date(checkinValor);
        const checkoutNueva = new Date(checkoutValor);

        // VALIDACIONES: asegúrate de que las fechas sean válidas.
        if (isNaN(checkinNueva.getTime()) || isNaN(checkoutNueva.getTime())) {
            alert("VALIDACIONES: Las fechas ingresadas no son válidas.");
            return;
        }

        // VALIDACIONES: la fecha de salida debe ser posterior a la de entrada.
        if (checkoutNueva <= checkinNueva) {
            alert("VALIDACIONES: La fecha de salida (Check-Out) debe ser posterior a la fecha de entrada (Check-In).");
            return;
        }

        // 2. Carga las reservas existentes desde localStorage o usa un arreglo vacío si no existe ninguna.
        const reservasExistentes = JSON.parse(localStorage.getItem("reservas_hotel")) || [];

        // 3. Verificar si hay un choque de fechas para la misma habitación seleccionada.
        const existeChoque = reservasExistentes.some(reserva => {
            // Solo revisa reservas anteriores de la misma habitación.
            if (reserva.habitacion === habitacion) {
                const checkinExistente = new Date(reserva.checkin);
                const checkoutExistente = new Date(reserva.checkout);

                // Hay choque si las fechas se sobrelapan.
                return (checkinNueva <= checkoutExistente && checkoutNueva >= checkinExistente);
            }
            return false;
        });

        // 4. Si hay choque, muestra error; si no, guarda la nueva reserva.
        if (existeChoque) {
            alert(`⚠️ Lo sentimos. La habitación "${formatearNombreHabitacion(habitacion)}" ya está reservada en las fechas seleccionadas. Por favor, intenta con otro rango de días.`);
        } else {
            // Si no hay choque, construimos el objeto de la nueva reserva.
            const nuevaReserva = {
                id: Date.now(), // ID único basado en el tiempo actual.
                nombre, // Nombre del huésped.
                email, // Email de contacto.
                habitacion, // Identificador de la habitación elegida.
                huespedes, // Cantidad de huéspedes.
                peticiones, // Peticiones especiales opcionales.
                checkin: checkinValor, // Fecha de entrada como texto.
                checkout: checkoutValor // Fecha de salida como texto.
            };

            // Agrega la nueva reserva al arreglo de reservas existentes.
            reservasExistentes.push(nuevaReserva);
            // Guarda el arreglo actualizado en localStorage.
            localStorage.setItem("reservas_hotel", JSON.stringify(reservasExistentes));

            // Muestra mensaje de confirmación y limpia el formulario.
            alert(`✅ ¡Reserva confirmada con éxito, ${nombre}! Te esperamos para tu estadía.`);
            formulario.reset(); // Limpia los campos del formulario automáticamente.
        }
    });
});

// ============================================================
//  RESERVAS.JS — Función auxiliar para nombres de habitaciones
// ============================================================
function formatearNombreHabitacion(slug) {

    const nombres = {
        "suite-presidencial": "Suite Presidencial",
        "suite-junior": "Suite Junior",
        "doble-deluxe": "Doble Deluxe",
        "familiar-superior": "Familiar Superior",
        "individual-ejecutiva": "Individual Ejecutiva"
    };
    // Devuelve el nombre legible si existe, o el slug original si no se encuentra.
    return nombres[slug] || slug;
}