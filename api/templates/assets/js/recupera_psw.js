$('#recuperarForm').on('submit', function(e) {
    e.preventDefault();

    var email = $(this).find('input[name="email"]').val();
    var message = $(this).find('input[name="message"]').val();

    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            message: message
        })
    };

    fetch('http://127.0.0.1:5000/recuperar', options)
    .then(response => response.json())
    .then(data => {
        // código para procesar los datos
        if (data.status === 'success') {
            alert('Correo enviado con éxito!');
        } else {
            alert('Hubo un error al enviar el correo.');
        }
    })
    .catch(error => {
        // código para manejar el error
        console.error(error);
        alert('Hubo un error al enviar el correo.');
    });
});
