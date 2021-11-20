module.exports = class Chat {
    constructor(){
        let options = require('../options/sqlite3.js');
        let knex = require('knex');
        
        this.objKnex = knex(options);
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