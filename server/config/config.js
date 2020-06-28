// ==============
// Puerto
// ==============
process.env.PORT = process.env.PORT || 3000;



// ==============
// Entorno
// ==============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ==============
// Vencimiento del token
// ==============
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ==============
// Semilla del token 
// ==============
process.env.SEED = process.env.SEED || 'este-es-el-secret-en-desarrollo';
// ==============
// Base de datos
// ==============
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27018/cafe';
} else {
    console.log('Aca iria la url productiva');
}

process.env.URLDB = urlDB;

// ==============
// Google client ID
// ==============
process.env.CLIENT_ID = process.env.CLIENT_ID || '95878047732-nr1ft53g77rkoggcve0cr9von9bacolv.apps.googleusercontent.com';