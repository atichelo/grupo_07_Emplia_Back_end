function logueado() {
    var usuario = localStorage.getItem('usuario');
    if (usuario) {
        var userMenu = document.getElementById('userMenu');
        if (userMenu) {
            var botonIngresar = document.querySelector('.ingresar');
            botonIngresar.outerHTML = `
                <div class="dropdown">
                    <button class="dropbtn"><i class="fa fa-user-circle"></i> ${localStorage.getItem('usuario')}
                        <i class="fa fa-caret-down"></i>
                    </button>
                    <div class="dropdown-content">
                        <a href="./pages/crear-cuenta.html">Perfil</a>
                        <a href="./pages/curriculum.html">Currículum vítae</a>
                        <a href="#" onclick="logout()">Cerrar sesión</a>
                    </div>
                </div>
            `;
            menuDesplegable.innerHTML = `
                <li><a href="#cuenta-empresas">Cuenta empresas</a></li>
                <li><a href="#publica-gratis">Publicá gratis</a></li>
                <li><a href="./pages/crear-cuenta.html">Perfil</a></li>
                <li><a href="./pages/curriculum.html">Currículum vítae</a></li>
                <li><a href="#" onclick="logout()">Cerrar sesión</a></li>
            `;

            var dropdown = document.querySelector('.dropdown');
            var dropdownContent = document.querySelector('.dropdown-content');

            dropdown.onclick = function(event) {
                if (event.target.classList.contains('fa-caret-down')) {
                    if (dropdownContent.style.display === 'none') {
                        dropdownContent.style.display = 'block';
                    } else {
                        dropdownContent.style.display = 'none';
                    }
                }
            }
        }
        return true;
    } else {
        return false;
    }
}

window.onload = function() {
    logueado();
}

function logout() {
    localStorage.removeItem('usuario');
    location.reload();
}
