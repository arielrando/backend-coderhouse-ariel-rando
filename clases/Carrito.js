module.exports = class Carrito {
    constructor(title='',price=0,thumbnail=''){
        this.manejoArchivosAux = require('./ManejoArchivos.js');
        this.dbFileText = 'carritos.txt';
        this.moment = require('moment');  
        let productos = require('./Productos.js');
        this.prod = new productos;
    }

    async getAll(){
        try{
            let test = await this.manejoArchivosAux.obtenerArchivoJson(this.dbFileText);
            return test;
        }catch(err){
            console.log('No se pudo leer el archivo de los carritos: ',err);
        }
    }

    async create(){
        try{
            let test = await this.manejoArchivosAux.obtenerArchivoJson(this.dbFileText);
            let carrito = {};
            carrito.fecha = this.moment().format('DD/MM/YYYY HH:mm:ss');
            carrito.productos = [];
            if(test && test.length>0){
                carrito.id  = test[test.length-1].id+1;
                test.push(carrito);
            }else{
                carrito.id = 1
                test = [carrito];
            }
            await this.manejoArchivosAux.grabarArchivoJson(this.dbFileText,test);
            return carrito.id;
        }catch(err){
            console.log('No se pudo grabar el archivo de los carritos: ',err);
        }
    }

    async getProductsById(num){
        try{
            let test = await this.manejoArchivosAux.obtenerArchivoJson(this.dbFileText);
            let result = null;
            if(test){
                let index = test.findIndex(x => x.id == num);
                if(index != -1){
                    result = [];
                    await Promise.all(test[index].productos.map(async (elementProducto) => {
                        let prodAux = await this.prod.getById(elementProducto.idProducto);
                        if(prodAux){
                            elementProducto.title = prodAux.title;
                            elementProducto.price = prodAux.price;
                            elementProducto.thumbnail = prodAux.thumbnail;
                            result.push(elementProducto);
                        }
                    }));
                }     
            }
            return result;
        }catch(err){
            console.log('No se encontro el carrito ',num,': ',err);
        }
    }

    async addProduct(carrito,producto){
        try{
            if(!producto.cantidad || isNaN(producto.cantidad)){
                producto.cantidad = 1;
            }
            let buscado = await this.prod.getById(producto.id);
            if(buscado){
                let test = await this.manejoArchivosAux.obtenerArchivoJson(this.dbFileText);
                let result = null;
                let index = null;
                if(test){
                    test.forEach(function (element, i) {
                        if(element.id==carrito){
                            result = element;
                            index = i;
                        }
                    });
                }
                if(result){
                    let indexProducto = result.productos.findIndex(x => x.idProducto === producto.id);
                    if(indexProducto!= -1){
                        result.productos[indexProducto].cantidad+=producto.cantidad;
                    }else{
                        let productoNuevo= {}
                        productoNuevo.idProducto = producto.id;
                        productoNuevo.cantidad = producto.cantidad;
                        productoNuevo.fecha = this.moment().format('DD/MM/YYYY HH:mm:ss');
                        if(result.productos && result.productos.length>0){
                            productoNuevo.id  = result.productos[result.productos.length-1].id+1;
                            result.productos.push(productoNuevo);
                            
                        }else{
                            productoNuevo.id  = 1
                            result.productos = [productoNuevo];
                        }
                    }
                    test[index] = result;
                    await this.manejoArchivosAux.grabarArchivoJson(this.dbFileText,test);
                    return {status:1, mensaje:"El producto "+producto.id+" fue agregado al carrito"+carrito}
                }else{
                    return {status:2, mensaje:"El carrito "+carrito+" no existe"}
                }
            }else{
                return {status:2, mensaje:"El producto "+producto.id+" no existe"}
            }
        }catch(err){
            console.log('No se pudo agregar el producto ',producto.id,' al carrito',carrito,': ',err);
        }
    }

    async deleteProduct(carrito,producto){
        try{
            let buscado = await this.prod.getById(producto);
            if(buscado){
                let test = await this.manejoArchivosAux.obtenerArchivoJson(this.dbFileText);
                let result = null;
                let index = null;
                if(test){
                    test.forEach(function (element, i) {
                        if(element.id==carrito){
                            result = element;
                            index = i;
                        }
                    });
                }
                if(result){
                    let indexProducto = result.productos.findIndex(x => x.idProducto == producto);
                    if(indexProducto!= -1){
                        result.productos.splice(indexProducto, 1);
                    }else{
                        return {status:2, mensaje:"El producto "+producto+" no existe en el carrito "+carrito}
                    }
                    test[index] = result;
                    await this.manejoArchivosAux.grabarArchivoJson(this.dbFileText,test);
                    return {status:1, mensaje:"El producto "+producto+" fue borrado del carrito"+carrito}
                }else{
                    return {status:2, mensaje:"El carrito "+carrito+" no existe"}
                }
            }else{
                return {status:2, mensaje:"El producto "+producto+" no existe"}
            }
        }catch(err){
            console.log('No se pudo agregar el producto ',producto,' al carrito',carrito,': ',err);
        }
    }

    async getById(num){
        try{
            let test = await this.manejoArchivosAux.obtenerArchivoJson(this.dbFileText);
            let result = null;
            if(test){
                test.forEach(element => {
                    if(element.id==num){
                        result = element;
                    }
                });
            }
            return result;
        }catch(err){
            console.log('No se pudo buscar el carrito ',num,': ',err);
        }
    }

    async deleteById(num){
        try{
            let test = await this.manejoArchivosAux.obtenerArchivoJson(this.dbFileText);

            test.forEach(function (element, index) {
                if(element.id==num){
                    test.splice(index, 1);
                }
            });
            await this.manejoArchivosAux.grabarArchivoJson(this.dbFileText,test);
        }catch(err){
            console.log('No se pudo borrar el carrito ',num,': ',err);
        }
    }

    async deleteAll(){
        await this.manejoArchivosAux.grabarArchivo(this.dbFileText,``);
    }
}