const generalDao = require('./daos/generalDao.js');
const {DBdefault} = require('../config.js');

module.exports = class Productos extends generalDao {
    constructor(){
        switch (DBdefault) {
            case 'archivoTexto':
                super('./DB/productos.txt');
            break;
            case 'mysql':
                super('productos');
            break;
            case 'mongoDB':
                let esquema = {
                    codigo: {type: String, required: true},
                    nombre: {type: String, required: true},
                    fechaCreacion: {type: Date, default: Date.now},
                    fechaModificacion: {type: Date, default: Date.now},
                    descripcion: {type: String},
                    foto: {type: String, required: true},
                    stock: {type: Number, default:0},
                    precio: {type: Number, required: true}

                };
                super('productos',esquema)
            break;
            case 'firebase':
                super('productos');
            break;
            case 'sqlite3':
                super('productos');
            break;
            default:
                super('./DB/productos.txt');
            break;
        }
        this.faker = require('faker');
        this.faker.locale = 'es'
    }

    getRandoms(cant = 5){
        if(!cant || isNaN(cant) || cant == 0){
            cant = 5;
        }

        const {  commerce, datatype, image } = this.faker;
        let todos = new Array();
        for (let i = 0; i < cant; i++) {
            todos.push({id:datatype.number(), codigo: datatype.number(), nombre: commerce.productName(), precio: commerce.price(), foto:image.image()});
        }

        return todos;
    }
}