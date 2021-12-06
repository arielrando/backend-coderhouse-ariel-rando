const {DBdefault} = require('../../config.js');

let generalDao;

switch (DBdefault) {
    case 'archivoTexto':
        generalDao =  require("../manejadores/ManejoArchivos.js");
    break;
    case 'mysql':
        generalDao = require("../manejadores/MySQLclient.js");
    break;
    case 'sqlite3':
        generalDao = require("../manejadores/SQLite3client.js");
    break;
    case 'mongoDB':
        generalDao = require("../manejadores/MongoDBclient.js");
    break;
    case 'firebase':
        generalDao = require("../manejadores/Firebaseclient.js");
    break;
    default:
        generalDao =  require("../manejadores/ManejoArchivos.js");
    break;
}

module.exports = generalDao;