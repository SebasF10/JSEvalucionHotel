const reportData = {
    2020: [
        { mes: 'Enero', ocupacion: '82%', cancelaciones: 3, ingresos: 45200000 },
        { mes: 'Febrero', ocupacion: '76%', cancelaciones: 4, ingresos: 39800000 },
        { mes: 'Marzo', ocupacion: '88%', cancelaciones: 2, ingresos: 47100000 },
        { mes: 'Abril', ocupacion: '79%', cancelaciones: 6, ingresos: 41200000 },
        { mes: 'Mayo', ocupacion: '85%', cancelaciones: 3, ingresos: 44300000 },
        { mes: 'Junio', ocupacion: '91%', cancelaciones: 1, ingresos: 48700000 },
        { mes: 'Julio', ocupacion: '94%', cancelaciones: 2, ingresos: 51200000 },
        { mes: 'Agosto', ocupacion: '90%', cancelaciones: 3, ingresos: 49600000 },
        { mes: 'Septiembre', ocupacion: '80%', cancelaciones: 5, ingresos: 42800000 },
        { mes: 'Octubre', ocupacion: '84%', cancelaciones: 4, ingresos: 43900000 },
        { mes: 'Noviembre', ocupacion: '78%', cancelaciones: 6, ingresos: 40100000 },
        { mes: 'Diciembre', ocupacion: '89%', cancelaciones: 2, ingresos: 46800000 },
    ],
    2021: [
        { mes: 'Enero', ocupacion: '75%', cancelaciones: 5, ingresos: 39500000 },
        { mes: 'Febrero', ocupacion: '68%', cancelaciones: 7, ingresos: 34200000 },
        { mes: 'Marzo', ocupacion: '82%', cancelaciones: 4, ingresos: 40200000 },
        { mes: 'Abril', ocupacion: '77%', cancelaciones: 5, ingresos: 38400000 },
        { mes: 'Mayo', ocupacion: '83%', cancelaciones: 4, ingresos: 42100000 },
        { mes: 'Junio', ocupacion: '86%', cancelaciones: 3, ingresos: 44600000 },
        { mes: 'Julio', ocupacion: '88%', cancelaciones: 4, ingresos: 45900000 },
        { mes: 'Agosto', ocupacion: '84%', cancelaciones: 5, ingresos: 43200000 },
        { mes: 'Septiembre', ocupacion: '73%', cancelaciones: 6, ingresos: 37800000 },
        { mes: 'Octubre', ocupacion: '79%', cancelaciones: 5, ingresos: 40100000 },
        { mes: 'Noviembre', ocupacion: '72%', cancelaciones: 7, ingresos: 36400000 },
        { mes: 'Diciembre', ocupacion: '85%', cancelaciones: 3, ingresos: 43800000 },
    ],
    2022: [
        { mes: 'Enero', ocupacion: '88%', cancelaciones: 2, ingresos: 47200000 },
        { mes: 'Febrero', ocupacion: '84%', cancelaciones: 3, ingresos: 44500000 },
        { mes: 'Marzo', ocupacion: '90%', cancelaciones: 1, ingresos: 50300000 },
        { mes: 'Abril', ocupacion: '86%', cancelaciones: 2, ingresos: 46800000 },
        { mes: 'Mayo', ocupacion: '91%', cancelaciones: 1, ingresos: 49600000 },
        { mes: 'Junio', ocupacion: '93%', cancelaciones: 2, ingresos: 51600000 },
        { mes: 'Julio', ocupacion: '95%', cancelaciones: 2, ingresos: 53800000 },
        { mes: 'Agosto', ocupacion: '92%', cancelaciones: 3, ingresos: 51100000 },
        { mes: 'Septiembre', ocupacion: '85%', cancelaciones: 4, ingresos: 47100000 },
        { mes: 'Octubre', ocupacion: '87%', cancelaciones: 3, ingresos: 48500000 },
        { mes: 'Noviembre', ocupacion: '81%', cancelaciones: 4, ingresos: 44900000 },
        { mes: 'Diciembre', ocupacion: '93%', cancelaciones: 2, ingresos: 52300000 },
    ],
};

function formatMoney(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(value);
}

function renderReport(year) {
    const rows = reportData[year] || [];
    const tbody = document.getElementById('report-tbody');
    const yearLabel = document.getElementById('report-year');
    const result = document.getElementById('report-result');
    const totalOcupacion = document.getElementById('report-total-ocupacion');
    const totalCancelaciones = document.getElementById('report-total-cancelaciones');
    const totalIngresos = document.getElementById('report-total-ingresos');

    tbody.innerHTML = '';
    let sumCancelaciones = 0;
    let sumIngresos = 0;
    let countOcupacion = 0;

    rows.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.mes}</td>
            <td>${item.ocupacion}</td>
            <td>${item.cancelaciones}</td>
            <td>${formatMoney(item.ingresos)}</td>
        `;
        tbody.appendChild(row);

        sumCancelaciones += item.cancelaciones;
        sumIngresos += item.ingresos;
        countOcupacion += parseInt(item.ocupacion, 10);
    });

    const averageOcupacion = rows.length ? `${Math.round(countOcupacion / rows.length)}%` : '0%';
    yearLabel.textContent = `Año ${year}`;
    totalOcupacion.textContent = averageOcupacion;
    totalCancelaciones.textContent = sumCancelaciones;
    totalIngresos.textContent = formatMoney(sumIngresos);
    result.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('show-report');
    const select = document.getElementById('year-select');

    if (!button || !select) {
        return;
    }

    button.addEventListener('click', () => {
        renderReport(select.value);
    });
});
