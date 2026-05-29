// ============================================================
//  TUS_RESERVAS.JS — Mostrar y cancelar reservas guardadas
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    const listaReservas = document.getElementById("lista-reservas");

    // Recuperar reservas guardadas en localStorage
    const reservas = JSON.parse(localStorage.getItem("reservas_hotel")) || [];

    if (reservas.length === 0) {
        listaReservas.innerHTML = `
            <div class="card-reserva">
                <p>No tienes reservas activas en este momento.</p>
            </div>
        `;
        return;
    }

    // Mostrar cada reserva en una tarjeta
    reservas.forEach(reserva => {
        const card = document.createElement("div");
        card.classList.add("card-reserva");

        card.innerHTML = `
            <h3>${formatearNombreHabitacion(reserva.habitacion)}</h3>
            <p><strong>Nombre:</strong> ${reserva.nombre}</p>
            <p><strong>Email:</strong> ${reserva.email}</p>
            <p><strong>Huéspedes:</strong> ${reserva.huespedes}</p>
            <p><strong>Check-In:</strong> ${reserva.checkin}</p>
            <p><strong>Check-Out:</strong> ${reserva.checkout}</p>
            ${reserva.peticiones ? `<p><strong>Peticiones:</strong> ${reserva.peticiones}</p>` : ""}
            <div class="card-actions">
                <button class="btn-factura" data-id="${reserva.id}">Factura</button>
                <button class="btn-cancelar" data-id="${reserva.id}">Cancelar Reserva</button>
            </div>
        `;

        listaReservas.appendChild(card);
    });

    // Manejar cancelación
    listaReservas.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-cancelar")) {
            const id = parseInt(e.target.dataset.id);

            // Filtrar reservas y actualizar localStorage
            const nuevasReservas = reservas.filter(r => r.id !== id);
            localStorage.setItem("reservas_hotel", JSON.stringify(nuevasReservas));

            // Eliminar tarjeta del DOM
            e.target.closest(".card-reserva").remove();

            // Si ya no quedan reservas, mostrar mensaje
            if (nuevasReservas.length === 0) {
                listaReservas.innerHTML = `
                    <div class="card-reserva">
                        <p>No tienes reservas activas en este momento.</p>
                    </div>
                `;
            }

            alert("❌ Reserva cancelada con éxito.");
        }

        if (e.target.classList.contains("btn-factura")) {
            const id = e.target.dataset.id;
            window.location.href = `facturacion.html?reservaId=${id}`;
        }
    });
});

// ============================================================
//  TUS_RESERVAS.JS — Función auxiliar para nombres de habitación
// ============================================================
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
