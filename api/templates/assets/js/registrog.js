/// Configuración de Firebase
var firebaseConfig = {
    apiKey: "AIzaSyC7mEavo7s6INFgGovCWmLKd7wAQnzp-x8",
    authDomain: "emplia.firebaseapp.com",
    projectId: "emplia",
    storageBucket: "emplia.appspot.com",
    messagingSenderId: "333111552452",
    appId: "1:333111552452:web:5681e59f2d84271ff4dc91",
    measurementId: "G-Q1P93ETCW8"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Proveedor de Google
var provider = new firebase.auth.GoogleAuthProvider();

// Iniciar sesión con Google
firebase.auth().signInWithPopup(provider).then(function(result) {
    // Token de acceso de Google
    var token = result.credential.accessToken;
    // Información del usuario
    var user = result.user;
    console.log(token, user);
}).catch(function(error) {
    // Manejar errores aquí
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage);
});