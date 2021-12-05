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
    
    break;
    default:

    break;
}

module.exports = productosDao;