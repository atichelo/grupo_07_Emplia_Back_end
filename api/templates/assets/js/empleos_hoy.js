window.onload = function() {
    document.getElementById('verSeleccion').addEventListener('click', function() {
        localStorage.setItem('cargarEmpleos', 'true');
        window.location.href='pages/ver-seleccion.html';
    });
}

const selectArea = document.getElementById('area');
const selectModalidad = document.getElementById('modalidad-de-trabajo');
const selectFechaPublicacion = document.getElementById('fecha-de-publicacion');

selectArea.addEventListener('change', handleSelectionChange);
selectModalidad.addEventListener('change', handleSelectionChange);
selectFechaPublicacion.addEventListener('change', handleSelectionChange);

// Función para manejar el cambio de selección
function handleSelectionChange() {
    const area = selectArea.value;
    const modalidad = selectModalidad.value;
    const fecha = selectFechaPublicacion.value;

    const datos = {
        area: area,
        modalidad: modalidad,
        fecha_publicacion: fecha
    };

    // Enviar la solicitud al servidor con los datos seleccionados
   /*fetch('http://localhost:5000/empleoshoy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    })
    .then(response => response.json())
    .then(data => {
        // Limpiar la tabla antes de agregar nuevas filas
        const tabla = document.getElementById('empleos-grid');
        tabla.innerHTML = '';//

        // Recorrer los empleos recuperados y agregar filas a la tabla
        data.forEach(empleo => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${empleo.id}</td>
                <td>${empleo.nombre_empresa}</td>
                <td>${empleo.area}</td>
                <td>${empleo.nombre_puesto}</td>
                <td>${empleo.descripcion}</td>
                <td>${empleo.modalidad}</td>
                <td>${empleo.fecha_publicacion}</td>
                <td>${empleo.localidad}</td>
                <td><input type="checkbox" name="seleccionar" value="${empleo.id}"></td>
            `;
            tabla.appendChild(fila);
        });
    })
    .catch(error => {
        console.error('Error al enviar la solicitud:', error);
    });*/
}

fetch('http://localhost:5000/empleoshoy')
.then(response => response.json())
.then(data => {
    const selectArea = document.getElementById('area');
    data.areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.text = area;
        selectArea.appendChild(option);
    });

    const selectModalidad = document.getElementById('modalidad-de-trabajo');
    data.modalidades.forEach(modalidad => {
        const option = document.createElement('option');
        option.value = modalidad;
        option.text = modalidad;
        selectModalidad.appendChild(option);
    });

    const selectFechaPublicacion = document.getElementById('fecha-de-publicacion');
    data.fechas_publicacion.forEach(fecha_publicacion => {
        const option = document.createElement('option');
        option.value = fecha_publicacion;
        option.text = fecha_publicacion;
        selectFechaPublicacion.appendChild(option);
    });
    
});