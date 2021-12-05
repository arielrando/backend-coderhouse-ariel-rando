module.exports = class SQLite3client {
    constructor(){
        let {optionsSqlite3} = require('../../config.js');
        let knex = require('knex');
        
        this.objKnex = knex(optionsSqlite3);
    }

    static async inicializarTablas(){
        try{
            let {optionsSqlite3} = require('../../config.js');
            let knex = require('knex');
            let knexAux = knex(optionsSqlite3);
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