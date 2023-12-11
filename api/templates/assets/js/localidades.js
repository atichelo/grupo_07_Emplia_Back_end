document.getElementById('location').addEventListener('input', function(e) {
    let nombre = e.target.value;
    if (nombre.length > 2) {
        obtenerLocalidades(nombre);
    }
});

function obtenerLocalidades(nombre) {
    fetch(`http://localhost:5000/localidades/${nombre}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(localidades => {
            let datalist = document.getElementById('location-list');
            datalist.innerHTML = '';
            localidades.forEach(localidad => {
                let option = document.createElement('option');
                option.value = localidad;
                datalist.appendChild(option);
            });
        })
        .then(localidades => {
            console.log('Localidades devueltas por la API:', localidades);
        })
        .catch(e => {
            console.log('Hubo un problema con la petición Fetch:' + e.message);
        });
}
document.getElementById('province').addEventListener('input', function() {
    var input = this.value;
    if (input.length > 2) {
        fetch('https://apis.datos.gob.ar/georef/api/provincias?nombre=' + input + '*')
            .then(response => response.json())
            .then(data => {
                var list = document.getElementById('province-list');
                list.innerHTML = '';
                data.provincias.forEach(function(item) {
                    var option = document.createElement('option');
                    option.value = item.nombre;
                    list.appendChild(option);
                });
            })
            .catch(error => console.error('Error:', error));
    }
});
