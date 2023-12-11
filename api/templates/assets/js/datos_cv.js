var experienciaContainer;
var educacionContainer;
document.addEventListener('DOMContentLoaded', function() {
  // Comprueba si hay datos guardados en localStorage
  if(localStorage.getItem('registroUsuario')) {
      // Recupera los datos del almacenamiento local
      var data = JSON.parse(localStorage.getItem('registroUsuario'));

      // Asigna los datos a los campos correspondientes
      document.getElementById('nombre').value = data.nombre;
      document.getElementById('apellido').value = data.apellido;
      document.getElementById('correo').value = data.correo;
      document.getElementById('telefono').value = data.telefono;
      document.getElementById('direccion').value = data.domicilio;
  }
});

function guardarDatos(event) {
  experienciaContainer = document.getElementById("experiencia-container");
  educacionContainer = document.getElementById("educacion-container");
  event.preventDefault();
  var datos = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    correo: document.getElementById("correo").value,
    telefono: document.getElementById("telefono").value,
    direccion: document.getElementById("direccion").value,
    resumen: document.getElementById("resumen").value,
    empresa: document.getElementById("empresa").value,
    puesto: document.getElementById("puesto").value,
    fecha_inicio: document.getElementById("fecha_inicio").value,
    fecha_fin: document.getElementById("fecha_fin").value,
    descripcion: document.getElementById("descripcion").value,
    titulo:document.getElementById("titulo").value,
    institucion: document.getElementById("institucion").value,
    inicio: document.getElementById("inicio").value,
    fin: document.getElementById("fin").value,
    habilidades: document.getElementById("habilidades").value,
    certificaciones: document.getElementById("certificaciones").value,
    cursos: document.getElementById("cursos").value,
    idiomas: document.getElementById("idiomas").value,
    logros: document.getElementById("logros").value,
    referencias: document.getElementById("referencias").value,
  };
  if (!datos) {
      
    return;
  }

  var experienciaCount = experienciaContainer.childElementCount;
  for (var i = 0; i < experienciaCount; i++) {
      var empresaElement = document.getElementById("empresa" + (i + 1));
      if (empresaElement) {
          datos["empresa" + (i + 1)] = empresaElement.value;
      }
      var puestoElement = document.getElementById("puesto" + (i + 1));
      if (puestoElement) {
          datos["puesto" + (i + 1)] = puestoElement.value;
      }
      
      var fechaInicioElement = document.getElementById("fecha_inicio" + (i + 1));
      if (fechaInicioElement) {
          datos["fecha_inicio" + (i + 1)] = fechaInicioElement.value;
      }
      
      var fechaFinElement = document.getElementById("fecha_fin" + (i + 1));
      if (fechaFinElement) {
          datos["fecha_fin" + (i + 1)] = fechaFinElement.value;
      }
      
      var descripcionElement = document.getElementById("descripcion" + (i + 1));
      if (descripcionElement) {
          datos["descripcion" + (i + 1)] = descripcionElement.value;
      }
  }
  var educacionCount = educacionContainer.childElementCount;
  for (var j = 0; j < educacionCount; j++) {
    datos["titulo" + (j + 1)] = document.getElementById("titulo" + (j + 1)).value;
    datos["institucion" + (j + 1)] = document.getElementById("institucion" + (j + 1)).value;
    datos["inicio" + (j + 1)] = document.getElementById("inicio" + (j + 1)).value;
    datos["fin" + (j + 1)] = document.getElementById("fin" + (j + 1)).value;
  }
 
  console.log(datos);
}

function addExperience() {
  var experienciaContainer = document.getElementById("experiencia-container");
  var experienciaCount = experienciaContainer.childElementCount + 1;
  var nuevaExperiencia = document.createElement("div");
  nuevaExperiencia.className = "mb-3 grid-container";
  nuevaExperiencia.innerHTML = `
    <div class="empuesto">
      <label for="empresa${experienciaCount}" class="form-label">Nombre de la empresa:</label>
      <input type="text" id="empresa${experienciaCount}" name="empresa${experienciaCount}" class="form-control" placeholder="Ingrese el nombre de la empresa">
      <label for="puesto${experienciaCount}" class="form-label">Puesto:</label>
      <input type="text" id="puesto${experienciaCount}" name="puesto${experienciaCount}" class="form-control" placeholder="Ingrese su puesto en la empresa">
    </div>
    <div class="fechas-container">
      <label for="fecha_inicio${experienciaCount}" class="form-label">Fecha de inicio:</label>
      <input type="date" id="fecha_inicio${experienciaCount}" name="fecha_inicio${experienciaCount}" class="form-control">
      <label for="fecha_fin${experienciaCount}" class="form-label">Fecha de fin:</label>
      <input type="date" id="fecha_fin${experienciaCount}" name="fecha_fin${experienciaCount}" class="form-control">
    </div>
    <label class="form-label">Descripción del trabajo:</label>
    <textarea id="descripcion" name="descripción${experienciaCount}" rows="4" class="form-control" placeholder="Describa sus responsabilidades y logros"></textarea>
  `;
  experienciaContainer.appendChild(nuevaExperiencia);
}

function addEducation() {
  var educacionContainer = document.getElementById("educacion-container");
  var educacionCount = educacionContainer.childElementCount + 1;
  var nuevaEducacion = document.createElement("div");
  nuevaEducacion.className = "mb-3 grid-containere";
  nuevaEducacion.innerHTML = `
    <label for="titulo${educacionCount}" class="form-label titulo">Título obtenido:</label>
    <input type="text" id="titulo${educacionCount}" name="titulo${educacionCount}" class="form-control grid-input" placeholder="Ej. Diploma de Educación">
    <label for="institucion${educacionCount}" class="form-label insti">Institución:</label>
    <input type="text" id="institucion${educacionCount}" name="institucion${educacionCount}" class="form-control grid-input">
    <label for="inicio${educacionCount}" class="form-label fini">Fecha de inicio:</label>
    <input type="date" id="inicio${educacionCount}" name="inicio${educacionCount}" class="form-control grid-input">
    <label for="fin${educacionCount}" class="form-label ffin">Fecha de finalización (si corresponde):</label>
    <input type="date" id="fin${educacionCount}" name="fin${educacionCount}" class="form-control grid-input">
  `;
  educacionContainer.appendChild(nuevaEducacion);
}