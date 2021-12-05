const prodDao = require('./daos/generalDao.js');
const {DBdefault} = require('../config.js');

module.exports = class Productos extends prodDao {
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
            
            break;
            default:
        
            break;
        }
    }
}