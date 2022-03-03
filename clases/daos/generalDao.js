require('dotenv').config();

let generalDao;

switch (DBdefault) {
    case 'archivoTexto':
        generalDao =  require("../drivers/ManejoArchivos.js");
    break;
    case 'mysql':
        generalDao = require("../drivers/MySQLclient.js");
    break;
    case 'sqlite3':
        generalDao = require("../drivers/SQLite3client.js");
    break;
    case 'mongoDB':
        generalDao = require("../drivers/MongoDBclient.js.js");
    break;
    case 'firebase':
        generalDao = require("../drivers/Firebaseclient.js");
    break;
    default:
        generalDao =  require("../drivers/ManejoArchivos.js");
    break;
}

module.exports = generalDao;