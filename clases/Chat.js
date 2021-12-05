module.exports = class Chat {
    constructor(){
        let {optionsSqlite3} = require('../config.js');
        let knex = require('knex');
        
        this.objKnex = knex(optionsSqlite3);
    }

    async save(mensaje){
        try{
            await this.objKnex('chats').insert(mensaje);
            return null;
        }catch(err){
            console.log('No se pudo grabar el chat en la base de datos: ',err);
        }
    }
}