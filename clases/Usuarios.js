const usuariosDao = require('./daos/usuariosDao.js');

module.exports = class Usuario extends usuariosDao{
    constructor(){
        switch (process.env.DBdefault) {
            case 'archivoTexto':
                super('./DB/users.txt');
            break;
            case 'mysql':
                super('users');
            break;
            case 'mongoDB':
                let esquema = {
                    email: {type: String, required: true},
                    password: {type: String, required: true},
                    nombre: {type: String, required: true},
                    apellido: {type: String, required: true},
                    direccion: {type: String, required: true},
                    edad: {type: Number, required: true},
                    telefono: {type: String, required: true},
                    foto: {type: String, required: true},
                    fechaCreacion: {type: Date, default: Date.now},
                    fechaUltimoLogin: {type: Date, default: Date.now}
                };
                super('users',esquema)    
            break;
            case 'firebase':
                super('users');
            break;
            case 'sqlite3':
                super('users');
            break;
            default:
                super('./DB/users.txt');
            break;
        }
    }
}