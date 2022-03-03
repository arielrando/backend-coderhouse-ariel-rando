module.exports = class SQLite3client {
    constructor(tabla, combierteJson = false){
        let {optionsSqlite3} = require('../../config.js');
        let knex = require('knex');
        
        this.objKnex = knex(optionsSqlite3);
        this.tabla = tabla;
        this.combierteJson = combierteJson;
    }

    static async inicializarTablas(){
        try{
            let {optionsSqlite3} = require('../../config.js');
            let knex = require('knex');
            let knexAux = knex(optionsSqlite3);
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
            await knexAux.schema.hasTable('carritos').then(async function(exists) {
                if (!exists) {
                    await knexAux.schema.createTable('carritos', function(table){
                        table.increments('id').primary();
                        table.datetime('fechaCreacion').defaultTo(knexAux.fn.now());
                        table.datetime('fechaModificacion').defaultTo(knexAux.fn.now());
                        table.text ('productos').nullable();
                    });
                }
            })
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

            await knexAux.schema.hasTable('users').then(async function(exists) {
                if (!exists) {
                    await knexAux.schema.createTable('users', function(table){
                        table.increments('id').primary();
                        table.string('email',100).notNullable();
                        table.string('password',200).notNullable();
                        table.string('nombre',50).notNullable();
                        table.string('apellido',50).notNullable();
                        table.string('direccion',100).notNullable();
                        table.integer('edad').notNullable();
                        table.string('telefono',100).notNullable();
                        table.string('telefonoInt',100).notNullable();
                        table.string('foto').notNullable();
                        table.datetime('fechaCreacion').defaultTo(knexAux.fn.now());
                        table.datetime('fechaUltimoLogin').defaultTo(knexAux.fn.now());
                    })
                }
            })
        }catch(err){
            console.log('No se pudo creat la tabla de productos: ',err);
        }
    }

    async getAll(){
        try{
            let test = await this.objKnex(this.tabla).select('*');
            return test;
        }catch(err){
            console.log('No se pudo obtener los datos de la tabla ',this.tabla,' de la base de datos: ',err);
        }
    }

    async save(item){
        try{
            if(this.combierteJson){
                for (const property in item) {
                    if((!!item[property]) && ((item[property].constructor === Array) || (item[property].constructor === Object))){
                        item[property] = JSON.stringify(item[property]);
                    }
                }
            }
            let resultado = await this.objKnex(this.tabla).insert(item, ['id']);
            if(resultado.length>0){
                return resultado[0];
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo grabar el dato en la tabla ',this.tabla,': ',err);
        }
    }

    async getById(num){
        try{
            let resultado = await this.objKnex(this.tabla).where('id',num).select('*');
            if(resultado.length>0){
                if(this.combierteJson){
                    for (const property in resultado[0]) {
                        if(this.IsJsonString(resultado[0][property])){
                            resultado[0][property] = JSON.parse(resultado[0][property]); 
                        }
                    }
                }
                return resultado[0];
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo buscar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async editById(num,item){
        try{
            let buscado = await this.objKnex(this.tabla).where('id',num).select('*');
            if(buscado.length>0){
                if(this.combierteJson){
                    for (const property in item) {
                        if((!!item[property]) && ((item[property].constructor === Array) || (item[property].constructor === Object))){
                            item[property] = JSON.stringify(item[property]);
                        }
                    }
                }
                let result = await this.objKnex.from(this.tabla).where('id', num).update(item);
                if(result){
                    item.id = num;
                    return item
                }else{
                    return null;
                }
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo modificar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async deleteById(num){
        try{
            let buscado = await this.objKnex(this.tabla).where('id',num).select('*');
            if(buscado.length>0){
                return await this.objKnex.from(this.tabla).where('id', num).del();
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo borrar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async deleteAll(){
        await this.objKnex(this.tabla).truncate();
    }

    IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
}