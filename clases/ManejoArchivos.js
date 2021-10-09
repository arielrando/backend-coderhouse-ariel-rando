module.exports = class ManejoArchivos{
    constructor(){
        
    }

    static async obtenerArchivoJson(archivo){
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

    static async grabarArchivoJson(archivo, objeto){
        try{
            const fs = require('fs');
            objeto = JSON.stringify(objeto);
            await fs.promises.writeFile(archivo, objeto);
        }catch(err){
            console.log('error al grabar el archivo ',archivo,' con el dato ',JSON.stringify(objeto),': ',err);
        }
    }

    static async grabarArchivo(archivo, texto){
        try{
            const fs = require('fs');
            await fs.promises.writeFile(archivo, texto);
        }catch(err){
            console.log('error al grabar el archivo ',archivo,' con el texto ',texto,': ',err);
        }
    }
}