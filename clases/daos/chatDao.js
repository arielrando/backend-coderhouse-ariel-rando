require('dotenv').config();

let chatDao;

switch (DBdefault) {
    case 'archivoTexto':
        chatDao =  require("../drivers/ManejoArchivos.js");
    break;
    case 'mysql':
        chatDao =  require("../drivers/ManejoArchivos.js");
    break;
    case 'sqlite3':
        chatDao =  require("../drivers/ManejoArchivos.js");
    break;
    case 'mongoDB':
        chatDao = require("../drivers/MongoDBclient.js.js");
    break;
    case 'firebase':
        chatDao = require("../drivers/Firebaseclient.js");
    break;
    default:
        chatDao =  require("../drivers/ManejoArchivos.js");
    break;
}

module.exports = chatDao;