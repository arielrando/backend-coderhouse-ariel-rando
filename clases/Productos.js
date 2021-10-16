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
            if(test){
                producto.id  = test.length+1;
                test.push(producto);
                
            }else{
                producto.id = 1
                test = [producto];
            }
            await this.manejoArchivosAux.grabarArchivoJson('productos.txt',test);
            return producto.id;
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

    async deleteById(num){
        try{
            let test = await this.manejoArchivosAux.obtenerArchivoJson('productos.txt');

            test.forEach(function (element, index) {
                if(element.id==num){
                    test[index]='';
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

