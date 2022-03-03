require('dotenv').config();

let usuariosDao;

switch (DBdefault) {
    case 'archivoTexto':
        usuariosDao =  require("../drivers/ManejoArchivos.js");
    break;
    case 'mysql':
        usuariosDao = require("../drivers/MySQLclient.js");
    break;
    case 'sqlite3':
        usuariosDao = require("../drivers/SQLite3client.js");
    break;
    case 'mongoDB':
        usuariosDao = require("../drivers/MongoDBclient.js.js");
    break;
    case 'firebase':
        usuariosDao = require("../drivers/Firebaseclient.js");
    break;
    default:
        usuariosDao =  require("../drivers/ManejoArchivos.js");
    break;
}

module.exports = usuariosDao;