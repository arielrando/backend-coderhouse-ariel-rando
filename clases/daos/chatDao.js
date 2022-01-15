require('dotenv').config();

let chatDao;

switch (process.env.DBdefault) {
    case 'archivoTexto':
        chatDao =  require("../manejadores/ManejoArchivos.js");
    break;
    case 'mysql':
        chatDao =  require("../manejadores/ManejoArchivos.js");
    break;
    case 'sqlite3':
        chatDao =  require("../manejadores/ManejoArchivos.js");
    break;
    case 'mongoDB':
        chatDao = require("../manejadores/MongoDBclient.js");
    break;
    case 'firebase':
        chatDao = require("../manejadores/Firebaseclient.js");
    break;
    default:
        chatDao =  require("../manejadores/ManejoArchivos.js");
    break;
}

module.exports = chatDao;