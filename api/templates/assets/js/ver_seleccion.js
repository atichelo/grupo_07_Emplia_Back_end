document.addEventListener('DOMContentLoaded', (event) => {
  cargarEmpleos();
});

function cargarEmpleos() {
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
                      <td><input type="checkbox" class="empleo-checkbox" value="${empleo.id}"></td>
                  </tr>`;
          });
          empleosGrid.innerHTML = html;
      })
      .catch(error => console.error('Error:', error));
}

window.onload = function() {
  if (localStorage.getItem('cargarEmpleos') === 'true') {
      cargarEmpleos();
      localStorage.removeItem('cargarEmpleos'); 
  }
}
document.getElementById('enviar-cv').addEventListener('click', function() {
  window.location.href = '../index.html';
});
