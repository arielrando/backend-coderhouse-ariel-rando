module.exports = class Productos {
    constructor(){
        let options = require('../options/mysql.js');
        let knex = require('knex');
        
        this.objKnex = knex(options);
    }

    async getAll(){
        try{
            let test = await this.objKnex('productos').select('*');
            return test;
        }catch(err){
            console.log('No se pudo obtener los productos de la base de datos: ',err);
        }
    }

    async save(producto){
        try{
            return await this.objKnex('productos').insert(producto, ['id']);
        }catch(err){
            console.log('No se pudo grabar el producto en la base de datos: ',err);
        }
    }

    async getById(num){
        try{
            return await this.objKnex('productos').where('id',num).select('*');
        }catch(err){
            console.log('No se pudo buscar el producto ',num,': ',err);
        }
    }

    async editById(num,producto){
        try{
            let buscado = await this.objKnex('productos').where('id',num).select('*');
            if(buscado.length>0){
                let result = await this.objKnex.from('productos').where('id', num).update(producto);
                if(result){
                    producto.id = num;
                    return producto
                }else{
                    return null;
                }
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo modificar el producto ',num,': ',err);
        }
    }

    async deleteById(num){
        try{
            let buscado = await this.objKnex('productos').where('id',num).select('*');
            if(buscado.length>0){
                return await this.objKnex.from('productos').where('id', num).del();
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo borrar el producto ',num,': ',err);
        }
    }

    async deleteAll(){
        await this.objKnex('productos').truncate();
    }
}