module.exports = class SQLite3client {
    constructor(){
        let options = require('../options/sqlite3.js');
        let knex = require('knex');
        
        this.objKnex = knex(options);
    }

    async inicializarTablas(){
        try{
            let knexAux = this.objKnex;
            await knexAux.schema.hasTable('chats').then(async function(exists) {
                if (!exists) {
                    await knexAux.schema.createTable('chats', function(table){
                        table.increments('id').primary();
                        table.string('usuario',100).notNullable();
                        table.text('mensaje').notNullable();
                        table.datetime('fecha').defaultTo(knexAux.fn.now());
                    })
                }
            })
        }catch(err){
            console.log('No se pudo creat la tabla de productos: ',err);
        }
    }
}