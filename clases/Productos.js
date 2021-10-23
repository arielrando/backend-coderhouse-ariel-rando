module.exports = class Productos {
    constructor(title='',price=0,thumbnail=''){
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
        this.manejoArchivosAux = require('./ManejoArchivos.js');
    }

    async getAll(){
        try{
            let test = await this.manejoArchivosAux.obtenerArchivoJson('productos.txt');
            return test;
        }catch(err){
            console.log('No se pudo leer el archivo de los productos ',archivo,': ',err);
        }
    }

    async save(producto){
        try{
            let test = await this.manejoArchivosAux.obtenerArchivoJson('productos.txt');
            let productoNuevo = {};
            if(test){
                productoNuevo.id  = test[test.length-1].id+1;
                productoNuevo.title = producto.title;
                productoNuevo.price = producto.price;
                productoNuevo.thumbnail = producto.thumbnail;
                test.push(productoNuevo);
                
            }else{
                producto.id = 1
                test = [producto];
                productoNuevo = producto;
            }
            await this.manejoArchivosAux.grabarArchivoJson('productos.txt',test);
            return productoNuevo.id;
        }catch(err){
            console.log('No se pudo grabar el archivo de los productos ',archivo,': ',err);
        }
    }

    async getById(num){
        try{
            let test = await this.manejoArchivosAux.obtenerArchivoJson('productos.txt');
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
            console.log('No se pudo buscar el producto ',num,': ',err);
        }
    }

    async editById(num,producto){
        try{
            let test = await this.manejoArchivosAux.obtenerArchivoJson('productos.txt');
            let result = null;
            let index = null;
            if(test){
                test.forEach(function (element, i) {
                    if(element.id==num){
                        result = element;
                        index = i;
                    }
                });
            }
            if(result){
                result.title = producto.title;
                result.price = producto.price;
                result.thumbnail = producto.thumbnail;
                test[index] = result;
                await this.manejoArchivosAux.grabarArchivoJson('productos.txt',test);
            }
            return result;
        }catch(err){
            console.log('No se pudo buscar el producto ',num,': ',err);
        }
    }

    async deleteById(num){
        try{
            let test = await this.manejoArchivosAux.obtenerArchivoJson('productos.txt');

            test.forEach(function (element, index) {
                if(element.id==num){
                    test.splice(index, 1);
                    console.log('entrada borrada');
                }
            });
            await this.manejoArchivosAux.grabarArchivoJson('productos.txt',test);
        }catch(err){
            console.log('No se pudo borrar el producto ',num,': ',err);
        }
    }

    async deleteAll(){
        await this.manejoArchivosAux.grabarArchivo('productos.txt',``);
    }
}

