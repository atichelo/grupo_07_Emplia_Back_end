from flask import Flask, jsonify, abort, send_from_directory, request
import requests
from flask_cors import CORS, cross_origin
import mysql.connector
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = Flask(__name__, static_folder='D:/Documents/grupo_07_Emplia_frontend/Emplia')
CORS(app)  # <-- Habilita CORS

@app.route('/bdempleos')
@cross_origin()  # <-- Permite solicitudes CORS para esta ruta
def bdempleos():
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="1234",
        database="empleos"
    )

    cursor = cnx.cursor()
    cursor.execute("SELECT * FROM Empleos")
    empleos = [empleo[3] for empleo in cursor.fetchall()]
    cnx.close()

    return jsonify(empleos)

@app.route('/empleoshoy', methods=['GET'])
@cross_origin()  # <-- Permite solicitudes CORS para esta ruta
def empleoshoy():
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="1234",
        database="empleos"
    )

    cursor = cnx.cursor()

    cursor.execute("SELECT DISTINCT area FROM Empleos")
    areas = [area[0] for area in cursor.fetchall()]

    cursor.execute("SELECT DISTINCT modalidad FROM Empleos")
    modalidades = [modalidad[0] for modalidad in cursor.fetchall()]

    cursor.execute("SELECT DISTINCT fecha_publicacion FROM Empleos")
    fechas_publicacion = [str(fecha_publicacion[0]) for fecha_publicacion in cursor.fetchall()]

    cnx.close()

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

if __name__ == '__main__':
    app.run(port=5000, debug=True)
