module.exports = class Chat {
    constructor(){
        this.manejoArchivosAux = require('./ManejoArchivos.js');
    }

    async save(mensaje){
        try{
            let test = await this.manejoArchivosAux.obtenerArchivoJson('chat.txt');
            if(test){
                test.push(mensaje);
            }else{
                test = [mensaje];
            }
            await this.manejoArchivosAux.grabarArchivoJson('chat.txt',test);
            return null;
        }catch(err){
            console.log('No se pudo grabar el archivo de los chats chat.txt: ',err);
        }
    }
}