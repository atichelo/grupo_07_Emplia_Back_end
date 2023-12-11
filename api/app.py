
from flask import Flask, jsonify, abort, send_from_directory, request
import requests
from flask_cors import CORS, cross_origin
import mysql.connector
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask_mysqldb import MySQL
from flask import render_template
app = Flask(__name__, static_folder='D:\Documents\grupo_07_Emplia_frontend')
app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '1234'
app.config['MYSQL_DB'] = 'empleos'

mysql = MySQL(app)

def render_json(data):
    return jsonify(data)  # <-- Devuelve una respuesta JSON con los datos

@app.route('/empleos', methods=['GET', 'POST'])
def empleos():
    cur = mysql.connection.cursor()
    if request.method == 'POST':
        # Crea un nuevo empleo
        nuevo_empleo = request.get_json()
        cur.execute("INSERT INTO empleos (nombre_empresa, area, nombre_puesto, descripcion, modalidad, fecha_publicacion, localidad) VALUES (%s, %s, %s, %s, %s, %s, %s)", (nuevo_empleo['nombre_empresa'], nuevo_empleo['area'], nuevo_empleo['nombre_puesto'], nuevo_empleo['descripcion'], nuevo_empleo['modalidad'], nuevo_empleo['fecha_publicacion'], nuevo_empleo['localidad']))
        mysql.connection.commit()
        return jsonify(nuevo_empleo)
    else:
        # Devuelve todos los empleos
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM empleos")
        empleos = [dict((cur.description[i][0], value) \
                for i, value in enumerate(row)) for row in cur.fetchall()]
        return jsonify(empleos)

@app.route('/empleos/<id>', methods=['GET', 'PUT', 'DELETE'])
def empleo(id):
    cur = mysql.connection.cursor()
    if request.method == 'PUT':
        # Actualiza un empleo
        actualizacion_empleo = request.get_json()
        cur.execute("UPDATE empleos SET nombre_empresa = %s, area = %s, nombre_puesto = %s, descripcion = %s, modalidad = %s, fecha_publicacion = %s, localidad = %s WHERE id = %s", (actualizacion_empleo['nombre_empresa'], actualizacion_empleo['area'], actualizacion_empleo['nombre_puesto'], actualizacion_empleo['descripcion'], actualizacion_empleo['modalidad'], actualizacion_empleo['fecha_publicacion'], actualizacion_empleo['localidad'], id))
        mysql.connection.commit()
        return jsonify(actualizacion_empleo)
    elif request.method == 'DELETE':
        # Elimina un empleo
        cur.execute("DELETE FROM empleos WHERE id = %s", (id,))
        mysql.connection.commit()
        return jsonify({'result': 'Empleo con id {} ha sido eliminado'.format(id)})
    else:
        # Busca un empleo
        cur.execute("SELECT * FROM empleos WHERE id = %s", (id,))
        empleo = cur.fetchone()
        return jsonify(empleo)
        
@app.route('/bdempleos')
@cross_origin()  # <-- Permite solicitudes CORS para esta ruta
def bdempleos():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM Empleos")
    empleos = [empleo[3] for empleo in cur.fetchall()]
    cur.close()
    return jsonify(empleos)

@app.route('/bdlocalidades')
@cross_origin()  
def bdlocalidades():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM Empleos")  # Consulta todos los datos de la tabla 'Empleos'
    localidades = [empleo[7] for empleo in cur.fetchall()]  # Extrae la localidad de cada fila (asumiendo que la localidad es la columna 7)
    cur.close()
    return jsonify(localidades)  # Devuelve las localidades como una respuesta JSON

@app.route('/empleoshoy', methods=['GET', 'POST'])
@cross_origin()
def empleoshoy():
    global result  # Indicar que quieres usar la variable global result
    cur = mysql.connection.cursor()  # Crear un solo cursor

    if request.method == 'POST':
        area = request.form.get('area') 
        modalidad = request.form.get('modalidad') 
        fecha_publicacion = request.form.get('fecha_publicacion') 
            
        if area and modalidad and fecha_publicacion:  
            cur.execute("SELECT * FROM Empleos WHERE area = %s AND modalidad = %s AND fecha_publicacion = %s", (area, modalidad, fecha_publicacion))
        elif area and modalidad:  
            cur.execute("SELECT * FROM Empleos WHERE area = %s AND modalidad = %s", (area, modalidad))
        elif area and fecha_publicacion: 
            cur.execute("SELECT * FROM Empleos WHERE area = %s AND fecha_publicacion = %s", (area, fecha_publicacion))
        elif modalidad and fecha_publicacion: 
            cur.execute("SELECT * FROM Empleos WHERE modalidad = %s AND fecha_publicacion = %s", (modalidad, fecha_publicacion))
        elif area: 
            cur.execute("SELECT * FROM Empleos WHERE area = %s", (area,))
        elif modalidad:  
            cur.execute("SELECT * FROM Empleos WHERE modalidad = %s", (modalidad,))
        elif fecha_publicacion: 
            cur.execute("SELECT * FROM Empleos WHERE fecha_publicacion = %s", (fecha_publicacion,))
        # Obtener los datos de la consulta y asignarlos a result
        result = cur.fetchall()
    elif request.method == 'GET': 
        cur.execute("SELECT DISTINCT area FROM Empleos")
        areas = [row[0] for row in cur.fetchall()]
        cur.execute("SELECT DISTINCT modalidad FROM Empleos")
        modalidades = [row[0] for row in cur.fetchall()]
        cur.execute("SELECT DISTINCT fecha_publicacion FROM Empleos")
        fechas_publicacion = [row[0] for row in cur.fetchall()]
    
        result = {
            "areas": areas,
            "modalidades": modalidades,
            "fechas_publicacion": fechas_publicacion
        }
    
    cur.close()
    return render_json(result)

@app.route('/localidades/<nombre>', methods=['GET'])
def obtener_localidades_por_nombre(nombre):
    url = f"https://apis.datos.gob.ar/georef/api/localidades?nombre={nombre}*"
    response = requests.get(url)
    if response.status_code != 200:
        abort(500, description="Error al comunicarse con la API de Georef.")
    localidades = response.json()['localidades']
    response_data = [localidad['nombre'] for localidad in localidades if localidad['nombre'].upper().startswith(nombre.upper())]
    response = jsonify(response_data)
    response.headers.add('Access-Control-Allow-Origin', '*')  # Agrega el encabezado CORS
    return response

@app.route('/provincias/<nombre>', methods=['GET'])
def obtener_provincias_por_nombre(nombre):
    url = f"https://apis.datos.gob.ar/georef/api/provincias?nombre={nombre}*"
    response = requests.get(url)
    if response.status_code != 200:
        abort(500, description="Error al comunicarse con la API de Georef.")
    provincias = response.json()['provincias']
    response_data = [provincia['nombre'] for provincia in provincias if provincia['nombre'].upper().startswith(nombre.upper())]
    response = jsonify(response_data)
    response.headers.add('Access-Control-Allow-Origin', '*')  # Agrega el encabezado CORS
    return response


@app.route('/recuperar', methods=['POST'])
@cross_origin()
def recuperar():
    email = request.json.get('email')
    correo = "emplia.empleos@gmail.com"
    password = "pybm keef zmci uojy" 

    # Configura el servidor SMTP
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(correo, password)

    # Crea el mensaje
    msg = MIMEMultipart()
    msg['From'] = correo
    msg['To'] = email
    msg['Subject'] = "Recuperar contraseña"
    body = "Para recuperar tu contraseña sigue el siguiente link: pages/nvo-psw.html"
    msg.attach(MIMEText(body, 'plain'))

    # Envia el correo
    text = msg.as_string()
    server.sendmail(correo, email, text)
    server.quit()

    return jsonify({'status': 'success', 'message': 'Correo enviado'}), 200

@app.route('/<path:path>', methods=['GET'])
def static_file(path):
    return send_from_directory(app.static_folder, path)

@app.route('/test_db')
def test_db():
    cur = mysql.connection.cursor()
    try:
        cur.execute("SELECT 1")
        return "Conectado a la base de datos"
    except Exception as e:
        return "No se pudo conectar a la base de datos: " + str(e)

@app.route('/datos', methods=['POST'])
def datos():
    cur = mysql.connection.cursor()
    nuevo_dato = request.get_json()
    cur.execute("INSERT INTO datos (nombre, apellido, correo, telefono, direccion, resumen, habilidades, certificaciones, cursos, idiomas, logros, referencias, cv) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (nuevo_dato['nombre'], nuevo_dato['apellido'], nuevo_dato['correo'], nuevo_dato['telefono'], nuevo_dato['direccion'], nuevo_dato['resumen'], nuevo_dato['habilidades'], nuevo_dato['certificaciones'], nuevo_dato['cursos'], nuevo_dato['idiomas'], nuevo_dato['logros'], nuevo_dato['referencias'], nuevo_dato['cv']))
    mysql.connection.commit()
    return jsonify(nuevo_dato)

@app.route('/educacion', methods=['POST'])
def educacion():
    cur = mysql.connection.cursor()
    nueva_educacion = request.get_json()
    
    required_fields = ['usuario_id', 'titulo', 'institucion', 'inicio', 'fin']
    if not all(field in nueva_educacion for field in required_fields):
        return jsonify({'error': 'Missing data'}), 400
    query = '''INSERT INTO educacion (usuario_id, titulo, institucion, inicio, fin)
               VALUES (%s, %s, %s, %s, %s)'''
    cursor.execute(query, (nueva_educacion['usuario_id'], nueva_educacion['titulo'], nueva_educacion['institucion'], nueva_educacion['inicio'], nueva_educacion['fin']))
    mysql.connection.commit()
    return jsonify({'status': 'success'}), 201

@app.route('/empleoscv', methods=['POST'])
def empleoscv():
    cursor = mysql.connection.cursor()
    n_empleo = request.get_json()
    
    required_fields = ['usuario_id', 'empresa', 'puesto', 'fecha_inicio', 'fecha_fin', 'descripcion']
    if not all(field in nueva_experiencia for field in required_fields):
        return jsonify({'error': 'Missing data'}), 400
    query = '''INSERT INTO empleoscv (usuario_id, empresa, puesto, fecha_inicio, fecha_fin, descripcion)
               VALUES (%s, %s, %s, %s, %s, %s)'''
    cursor.execute(query, (nueva_experiencia['usuario_id'], nueva_experiencia['empresa'], nueva_experiencia['puesto'], nueva_experiencia['fecha_inicio'], nueva_experiencia['fecha_fin'], nueva_experiencia['descripcion']))
    mysql.connection.commit()
    return jsonify({'status': 'success'}), 201

if __name__ == '__main__':
    app.run(port=5000, debug=True)
