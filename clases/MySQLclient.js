module.exports = class MySQLclient {
    constructor(){
        let options = require('../options/mysql.js');
        let knex = require('knex');
        
        this.objKnex = knex(options);
    }

    async inicializarTablas(){
        try{
            let knexAux = this.objKnex;
            await knexAux.schema.hasTable('productos').then(async function(exists) {
                if (!exists) {
                    await knexAux.schema.createTable('productos', function(table){
                        table.increments('id').primary();
                        table.string('codigo',20).notNullable();
                        table.string('nombre',50).notNullable();
                        table.datetime('fechaCreacion').defaultTo(knexAux.fn.now());
                        table.datetime('fechaModificacion').defaultTo(knexAux.fn.now());
                        table.string('descripcion',1000).nullable();
                        table.string('foto',500).nullable();
                        table.integer('stock').defaultTo(0);
                        table.decimal('precio', 14,2);
                    })
                    let productos = [
                        {"codigo":'001',"nombre":"Escuadra","precio":123.45,"stock":20,"foto":"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png"},
                        {"codigo":'002',"nombre":"Calculadora","precio":234.56,"stock":54,"foto":"https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png"},
                        {"codigo":'003',"nombre":"Globo Terraqueo","precio":345.67,"stock":127,"foto":"https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png"}
                    ]
                    await knexAux('productos').insert(productos);
                }
            })
            
        }catch(err){
            console.log('No se pudo creat la tabla de productos: ',err);
        }
    }
}