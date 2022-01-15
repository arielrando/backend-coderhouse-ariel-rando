require('dotenv').config();
const chatDao = require('./daos/chatDao.js');

module.exports = class Chat extends chatDao{
    constructor(){
        switch (process.env.DBdefault) {
            case 'archivoTexto':
                super('./DB/chats.txt');
            break;
            case 'mysql':
                super('./DB/chats.txt');
            break;
            case 'mongoDB':
                const mongooseAux = require('mongoose');
                const esquemaAutor = new mongooseAux.Schema({
                    mail: {type: String, required: true},
                    nombre: {type: String},
                    apellido: {type: String},
                    edad: {type: Number},
                    alias: {type: String},
                    avatar: {type: String}
                });
                let esquema = {
                    fecha: {type: Date, default: Date.now},
                    mensaje: {type: String, required: true},
                    autor: {type: esquemaAutor, require: true}

                };
                super('chats',esquema)
            break;
            case 'firebase':
                super('chats');
            break;
            case 'sqlite3':
                super('./DB/chats.txt');
            break;
            default:
                super('./DB/chats.txt');
            break;
        }
    }
}