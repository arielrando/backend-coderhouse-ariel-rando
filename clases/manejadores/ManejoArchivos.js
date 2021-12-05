module.exports = class ManejoArchivos{
    constructor(tabla){
        this.tabla = tabla;
    }

    async obtenerArchivoJson(archivo){
        try{
            const fs = require('fs');
            const contenido = await fs.promises.readFile(archivo, 'utf-8');
            if(contenido){
                return (JSON.parse(contenido));
            }else{
                return '';
            }
        }catch(err){
            console.log('error al leer el archivo',archivo,':',err);
        }
    }

    async grabarArchivoJson(archivo, objeto){
        try{
            const fs = require('fs');
            objeto = JSON.stringify(objeto);
            await fs.promises.writeFile(archivo, objeto);
        }catch(err){
            console.log('error al grabar el archivo ',archivo,' con el dato ',JSON.stringify(objeto),': ',err);
        }
    }

    async grabarArchivo(archivo, texto){
        try{
            const fs = require('fs');
            await fs.promises.writeFile(archivo, texto);
        }catch(err){
            console.log('error al grabar el archivo ',archivo,' con el texto ',texto,': ',err);
        }
    }

    async getAll(){
        try{
            let test = await this.obtenerArchivoJson(this.tabla);
            return test;
        }catch(err){
            console.log('No se pudo leer el archivo de los carritos: ',err);
        }
    }

    async save(item){
        try{
            let test = await this.obtenerArchivoJson(this.tabla);
            if(test && test.length>0){
                item.id = (!item.id || item.id.length === 0 || item.id === 0)?test[test.length-1].id+1:item.id;
                test.push(item);
            }else{
                item.id = (!item.id || item.id.length === 0 || item.id === 0)?1:item.id;
                test = [item];
            }
            await this.grabarArchivoJson(this.tabla,test);
            return item.id;
        }catch(err){
            console.log('No se pudo grabar el dato en el archivo ',this.tabla,': ',err);
        }
    }

    async getById(num){
        try{
            let test = await this.obtenerArchivoJson(this.tabla);
            let result = null;
            if(test){
                let item = test.find(x => x.id == num);
                if(item){
                    result = item;
                }     
            }
            return result;
        }catch(err){
            console.log('No se encontro el dato ',num,' en el archivo',this.tabla,': ',err);
        }
    }

    async editById(num,item){
        try{
            let test = await this.obtenerArchivoJson(this.tabla);
            let result = null;
            if(test){
                let index = test.findIndex(x => x.id == num);
                if(index != -1){
                    test[index] = item;
                    result = item;
                    await this.grabarArchivoJson(this.tabla,test);
                }     
            }
            return result;
        }catch(err){
            console.log('No se encontro el dato ',num,' en el archivo ',this.tabla,': ',err);
        }
    }

    async deleteById(num){
        try{
            let test = await this.obtenerArchivoJson(this.tabla);
            let resultado = false;
            test.forEach(function (element, index) {
                if(element.id==num){
                    test.splice(index, 1);
                    resultado = true;
                }
            });
            await this.grabarArchivoJson(this.tabla,test);
            return resultado;
        }catch(err){
            console.log('No se pudo borrar el dato ',num,' en el archivo ',this.tabla,': ',err);
        }
    }

    async deleteAll(){
        await this.grabarArchivoJson(this.tabla,'');
    }
}