document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formEmpleo');
    form.addEventListener('submit', crearEmpleo);

    function crearEmpleo(e) {
        e.preventDefault();
        const nuevoEmpleo = {
            nombre_empresa: document.getElementById('nombre_empresa').value,
            area: document.getElementById('area').value,
            nombre_puesto: document.getElementById('nombre_puesto').value,
            descripcion: document.getElementById('descripcion').value,
            modalidad: document.getElementById('modalidad').value,
            fecha_publicacion: document.getElementById('fecha_publicacion').value,
            localidad: document.getElementById('localidad').value
        };

        fetch('http://localhost:5000/empleos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoEmpleo)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            limpiarFormulario(); // Llama a la función para limpiar el formulario
        })
        .catch(error => console.error('Error:', error));
    }

    function limpiarFormulario() {
        document.getElementById('nombre_empresa').value = '';
        document.getElementById('area').value = '';
        document.getElementById('nombre_puesto').value = '';
        document.getElementById('descripcion').value = '';
        document.getElementById('modalidad').value = '';
        document.getElementById('fecha_publicacion').value = '';
        document.getElementById('localidad').value = '';
    }

    fetch('http://localhost:5000/empleos')
    .then(response => response.json())
    .then(data => {
        const empleosGrid = document.getElementById('empleos-grid');
        let html = '';
        data.forEach(empleo => {
            html += `<tr>
                    <td>${empleo.id}</td>
                    <td>${empleo.nombre_empresa}</td>
                    <td>${empleo.area}</td>
                    <td>${empleo.nombre_puesto}</td>
                    <td>${empleo.descripcion}</td>
                    <td>${empleo.modalidad}</td>
                    <td>${empleo.fecha_publicacion}</td>
                    <td>${empleo.localidad}</td>
                    <td><button class="actualizar" onclick="abrirVentanaModal(${empleo.id})">Actualizar</button></td>
                    <td><button class="eliminar" onclick="eliminarEmpleo(${empleo.id})">Eliminar</button></td>
                </tr>`;
        });
        empleosGrid.innerHTML = html;
    })
    .catch(error => console.error('Error:', error));
});

function abrirVentanaModal(id) {
    var modal = document.getElementById('modalActualizar');
    if (modal != null) {
        modal.style.display = 'block';
        var form = document.getElementById('formActualizar');
        if (form != null) {
            form.setAttribute('data-id', id);
        } else {
            console.log('El elemento formActualizar no existe');
        }
    } else {
        console.log('El elemento modalActualizar no existe');
    }
}
function cerrarVentanaModal() {
    var modal = document.getElementById('modalActualizar');
    if (modal != null) {
        modal.style.display = 'none';
    }
}
function actualizarEmpleo() {
    const id = document.getElementById('formActualizar').getAttribute('data-id');

    if (id === null) {
        console.error('El id es null');
        return;
    }
   
    const nombre_empresa = document.getElementById('update_nombre_empresa').value;
    const area = document.getElementById('update_area').value;
    const nombre_puesto = document.getElementById('update_nombre_puesto').value;
    const descripcion = document.getElementById('update_descripcion').value;
    const modalidad = document.getElementById('update_modalidad').value;
    const fecha_publicacion = document.getElementById('update_fecha_publicacion').value;
    const localidad = document.getElementById('update_localidad').value;

    const actualizacionEmpleo = {
        nombre_empresa: nombre_empresa,
        area: area,
        nombre_puesto: nombre_puesto,
        descripcion: descripcion,
        modalidad: modalidad,
        fecha_publicacion: fecha_publicacion,
        localidad: localidad
    }

    fetch(`http://localhost:5000/empleos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(actualizacionEmpleo)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        cerrarVentanaModal();
    })
    .catch(error => console.error('Error:', error));
}
function eliminarEmpleo(id) {
    fetch(`http://localhost:5000/empleos/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}
