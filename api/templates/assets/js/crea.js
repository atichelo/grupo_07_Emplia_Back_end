document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        var nombre_usuario = document.querySelector(
          'input[name="nombre_usuario"]'
        ).value;
        var contrasena = document.querySelector(
          'input[name="contrasena"]'
        ).value;
        var confirmar_contrasena = document.querySelector(
          'input[name="confirmar_contrasena"]'
        ).value;
        var nombre = document.querySelector('input[name="nombre"]').value;
        var apellido = document.querySelector('input[name="apellido"]').value;
        var correo = document.querySelector('input[name="correo"]').value;
        var telefono = document.querySelector('input[name="telefono"]').value;
        var domicilio = document.querySelector('input[name="domicilio"]').value;
        var localidad = document.querySelector('input[name="localidad"]').value;
        var provincia = document.querySelector('input[name="provincia"]').value;
        var foto = document.querySelector('input[name="foto"]').files[0];

        if (contrasena !== confirmar_contrasena) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        // Guarda los datos del formulario en el almacenamiento local
        var data = {
            nombre_usuario: nombre_usuario,
            contrasena: contrasena,
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            telefono: telefono,
            domicilio: domicilio,
            localidad: localidad,
            provincia: provincia,
            foto: foto ? URL.createObjectURL(foto) : null
        };

        localStorage.setItem('registroUsuario', JSON.stringify(data));

        // Imprime el objeto data en la consola
        console.log(data);

        document.getElementById('google-btn').addEventListener('click', function() {
            // Aquí iría el código para manejar la autenticación con Google
        });
        
        document.getElementById('facebook-btn').addEventListener('click', function() {
            // Aquí iría el código para manejar la autenticación con Facebook
        });
        
        document.getElementById('linkedin-btn').addEventListener('click', function() {
            // Aquí iría el código para manejar la autenticación con LinkedIn
        });

        // Redirige a continuar.html
        window.location.href = 'continuar.html';
    });
});
