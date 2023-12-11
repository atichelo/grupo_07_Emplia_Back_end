document.addEventListener('DOMContentLoaded', function() {

    var data = JSON.parse(localStorage.getItem('registroUsuario'));

    document.getElementById('nombre').value = data.nombre;
    document.getElementById('apellido').value = data.apellido;
    document.getElementById('correo').value = data.correo;
    document.getElementById('telefono').value = data.telefono;
    document.getElementById('direccion').value = data.domicilio;
    document.getElementById('localidad').value = data.localidad;
    document.getElementById('provincia').value = data.provincia;
});