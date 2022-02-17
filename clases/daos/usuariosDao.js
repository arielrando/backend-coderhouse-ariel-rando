require('dotenv').config();

let usuariosDao;

switch (process.env.DBdefault) {
    case 'archivoTexto':
        usuariosDao =  require("../manejadores/ManejoArchivos.js");
    break;
    case 'mysql':
        usuariosDao = require("../manejadores/MySQLclient.js");
    break;
    case 'sqlite3':
        usuariosDao = require("../manejadores/SQLite3client.js");
    break;
    case 'mongoDB':
        usuariosDao = require("../manejadores/MongoDBclient.js");
    break;
    case 'firebase':
        usuariosDao = require("../manejadores/Firebaseclient.js");
    break;
    default:
        usuariosDao =  require("../manejadores/ManejoArchivos.js");
    break;
}

module.exports = usuariosDao;