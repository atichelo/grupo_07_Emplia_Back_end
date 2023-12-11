var boton = document.querySelector('button[type="submit"].cv');

boton.addEventListener('click', function(event) {
    event.preventDefault();
    var ventanaFlotante = document.createElement('div');
    ventanaFlotante.style.width = '50%';
    ventanaFlotante.style.height = '50%';
    ventanaFlotante.style.background = '#fff';
    ventanaFlotante.style.position = 'fixed';
    ventanaFlotante.style.top = '50%';
    ventanaFlotante.style.left = '50%';
    ventanaFlotante.style.transform = 'translate(-50%, -50%)';
    ventanaFlotante.style.padding = '20px';
    ventanaFlotante.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.1)';
    ventanaFlotante.style.borderRadius = '10px'; 
    ventanaFlotante.innerHTML = '<h1>¡Su currículum se ha guardado con éxito!</h1>';

    var botonVolver = document.createElement('button');
    botonVolver.innerText = 'Volver al inicio';
    botonVolver.style.display = 'block';
    botonVolver.style.margin = '20px auto';
    botonVolver.addEventListener('click', function() {
        window.location.href = "../index.html";
    });

    ventanaFlotante.appendChild(botonVolver);

    document.body.appendChild(ventanaFlotante);

    ventanaFlotante.focus();
    localStorage.setItem('logueado', 'true');

    logueado();
});
