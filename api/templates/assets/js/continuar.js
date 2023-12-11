document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('.continuarBtn').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '../pages/curriculum.html';
    });

    document.querySelector('.continuarBtn1').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '../pages/ingresar.html';
    });
});
