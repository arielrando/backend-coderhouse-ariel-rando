const {DBdefault} = require('../../config.js');

let productosDao;

switch (DBdefault) {
    case 'archivoTexto':
        productosDao =  require("../manejadores/ManejoArchivos.js");
    break;
    case 'mysql':
        productosDao = require("../manejadores/MySQLclient.js");
    break;
    case 'mongoDB':
        productosDao = require("../manejadores/MongoDBclient.js");
    break;
    case 'firebase':
        productosDao = require("../manejadores/Firebaseclient.js");
    break;
    default:
        productosDao =  require("../manejadores/ManejoArchivos.js");
    break;
}

module.exports = productosDao;