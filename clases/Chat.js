const generalDao = require('./daos/generalDao.js');
const {DBdefault} = require('../config.js');

module.exports = class Chat extends generalDao{
    constructor(){
        switch (DBdefault) {
            case 'archivoTexto':
                super('./DB/chats.txt');
            break;
            case 'mysql':
                super('chats');
            break;
            case 'mongoDB':
                let esquema = {
                    usuario: {type: String, required: true},
                    fecha: {type: Date, default: Date.now},
                    mensaje: {type: String, required: true}

                };
                super('chats',esquema)
            break;
            case 'firebase':
                super('chats');
            break;
            case 'sqlite3':
                super('chats');
            break;
            default:
                super('./DB/chats.txt');
            break;
        }
    }
}