
from flask import Flask, jsonify, abort, send_from_directory, request
import requests
from flask_cors import CORS, cross_origin
import mysql.connector
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask_mysqldb import MySQL

app = Flask(__name__)
CORS(app)
# Configuración de MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '1234'
app.config['MYSQL_DB'] = 'empleos'

mysql = MySQL(app)

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

@app.route('/empleoshoy', methods=['GET'])
@cross_origin()  # <-- Permite solicitudes CORS para esta ruta
def empleoshoy():
    cur = mysql.connection.cursor()

    cur.execute("SELECT DISTINCT area FROM Empleos")
    areas = [area[0] for area in cur.fetchall()]

    cur.execute("SELECT DISTINCT modalidad FROM Empleos")
    modalidades = [modalidad[0] for modalidad in cur.fetchall()]

    cur.execute("SELECT DISTINCT fecha_publicacion FROM Empleos")
    fechas_publicacion = [str(fecha_publicacion[0]) for fecha_publicacion in cur.fetchall()]

    cur.close()

    return jsonify({'areas': areas, 'modalidades': modalidades, 'fechas_publicacion': fechas_publicacion})


@app.route('/localidades/<nombre>', methods=['GET'])
def obtener_localidades_por_nombre(nombre):
    #if not nombre.isalpha():
        #abort(400, description="La entrada debe ser solo letras.")
    url = f"https://apis.datos.gob.ar/georef/api/localidades?nombre={nombre}*"
    response = requests.get(url)
    if response.status_code != 200:
        abort(500, description="Error al comunicarse con la API de Georef.")
    localidades = response.json()['localidades']
    response_data = [localidad['nombre'] for localidad in localidades if localidad['nombre'].upper().startswith(nombre.upper())]
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


if __name__ == '__main__':
    app.run(port=5000, debug=True)
