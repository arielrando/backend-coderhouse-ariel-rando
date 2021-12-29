const usuariosDao = require('./daos/usuariosDao.js');

module.exports = class Usuario extends usuariosDao{
    constructor(){
        let esquema = {
            email: {type: String, required: true},
            password: {type: String, required: true}

        };
        super('users',esquema)    
    }
}