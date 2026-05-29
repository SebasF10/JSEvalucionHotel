// ============================================================
//  FACTURACION.JS — Genera una factura desde una reserva guardada
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    const selectReserva = document.getElementById("reserva-select");
    const btnGenerar = document.getElementById("btn-generar");
    const btnImprimir = document.getElementById("btn-imprimir");
    const facturaContenedor = document.getElementById("factura-contenedor");

    const reservas = JSON.parse(localStorage.getItem("reservas_hotel")) || [];

    function formatearNombreHabitacion(slug) {
        const nombres = {
            "suite-presidencial": "Suite Presidencial",
            "suite-junior": "Suite Junior",
            "doble-deluxe": "Doble Deluxe",
            "familiar-superior": "Familiar Superior",
            "individual-ejecutiva": "Individual Ejecutiva"
        };
        return nombres[slug] || slug;
    }

    function obtenerPrecioHabitacion(slug) {
        const precios = {
            "suite-presidencial": 420000,
            "suite-junior": 320000,
            "doble-deluxe": 220000,
            "familiar-superior": 280000,
            "individual-ejecutiva": 180000
        };
        return precios[slug] || 0;
    }

    function formatearMoneda(valor) {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0
        }).format(valor);
    }

    function obtenerFechaActual() {
        const hoy = new Date();
        return hoy.toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    function crearOpcionesReservas() {
        if (reservas.length === 0) {
            selectReserva.innerHTML = `<option value="">No hay reservas registradas</option>`;
            selectReserva.disabled = true;
            return;
        }

        selectReserva.innerHTML = `<option value="">Selecciona una reserva</option>`;
        reservas.forEach(reserva => {
            const texto = `${formatearNombreHabitacion(reserva.habitacion)} — ${reserva.nombre} (${reserva.checkin} → ${reserva.checkout})`;
            const option = document.createElement("option");
            option.value = reserva.id;
            option.textContent = texto;
            selectReserva.appendChild(option);
        });
    }

    function calcularNoches(checkin, checkout) {
        const fechaInicio = new Date(checkin);
        const fechaFinal = new Date(checkout);
        const milisegundosPorDia = 1000 * 60 * 60 * 24;
        return Math.round((fechaFinal - fechaInicio) / milisegundosPorDia);
    }

    function mostrarFactura(reserva) {
        const precioNoche = obtenerPrecioHabitacion(reserva.habitacion);
        const noches = calcularNoches(reserva.checkin, reserva.checkout);
        const total = precioNoche * noches;

        document.getElementById("factura-fecha").textContent = `Fecha de factura: ${obtenerFechaActual()}`;
        document.getElementById("factura-numero").textContent = `#${reserva.id}`;
        document.getElementById("factura-cliente").textContent = reserva.nombre;
        document.getElementById("factura-email").textContent = reserva.email;
        document.getElementById("factura-habitacion").textContent = formatearNombreHabitacion(reserva.habitacion);
        document.getElementById("factura-precio").textContent = formatearMoneda(precioNoche);
        document.getElementById("factura-checkin").textContent = reserva.checkin;
        document.getElementById("factura-checkout").textContent = reserva.checkout;
        document.getElementById("factura-noches").textContent = noches;
        document.getElementById("factura-huespedes").textContent = reserva.huespedes;
        document.getElementById("factura-peticiones").textContent = reserva.peticiones || "Ninguna";
        document.getElementById("factura-total").textContent = formatearMoneda(total);

        facturaContenedor.classList.remove("hidden");
        btnImprimir.disabled = false;
    }

    function actualizarEstados() {
        const valorSeleccionado = selectReserva.value;
        btnGenerar.disabled = !valorSeleccionado;
        if (!valorSeleccionado) {
            facturaContenedor.classList.add("hidden");
            btnImprimir.disabled = true;
        }
    }

    crearOpcionesReservas();

    selectReserva.addEventListener("change", actualizarEstados);

    btnGenerar.addEventListener("click", () => {
        const reservaSeleccionada = reservas.find(r => String(r.id) === selectReserva.value);
        if (reservaSeleccionada) {
            mostrarFactura(reservaSeleccionada);
        }
    });

    btnImprimir.addEventListener("click", () => {
        window.print();
    });

    const parametros = new URLSearchParams(window.location.search);
    const reservaIdParam = parametros.get("reservaId");
    if (reservaIdParam) {
        selectReserva.value = reservaIdParam;
        actualizarEstados();
        if (selectReserva.value) {
            const reservaSeleccionada = reservas.find(r => String(r.id) === reservaIdParam);
            if (reservaSeleccionada) {
                mostrarFactura(reservaSeleccionada);
            }
        }
    }
});
