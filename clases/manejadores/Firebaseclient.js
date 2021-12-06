module.exports = class Firebaseclient {
    constructor(tabla){
        this.admin = require("firebase-admin");
        let {optionsFirebase} = require('../../config.js');
        if (!this.admin.apps.length) {
            this.admin.initializeApp({
                credential: this.admin.credential.cert(optionsFirebase.conexion)
            });
         }else {
            this.admin.app(); 
         }
        
        this.db = this.admin.firestore();
        this.tabla = tabla;
        this.collection = this.db.collection(this.tabla);
    }

    static async inicializarTablas(){
        try{
            const admin = require("firebase-admin");
            let {optionsFirebase} = require('../../config.js');
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert(optionsFirebase.conexion)
                });
            }else {
                admin.app(); 
            }
            const db = admin.firestore();
            let snapshot = await db.collection('productos').limit(1).get();
            if (snapshot.size == 0) {
                (async() => {
                    await db.collection('productos').add({codigo:"001",nombre:"Escuadra",fechaCreacion: Date(),fechaModificacion: Date(),descripcion:null,precio:123.45,stock:20,foto:"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png"	});
                    await db.collection('productos').add({codigo:"002",nombre:"Calculadora",fechaCreacion: Date(),fechaModificacion: Date(),descripcion:null,precio:234.56,stock:54,foto:"https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png"	})
                    await db.collection('productos').add({codigo:"003",nombre:"Globo Terraqueo",fechaCreacion: Date(),fechaModificacion: Date(),descripcion:null,precio:345.67,stock:127,foto:"https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png"	})
                })();
            }
        }catch(err){
            console.log('no se pudieron inicializar las tablas: ',err);
        }
    }

    async getById(num) {
        try{
            const doc = await this.collection.doc(num).get();
            if(doc.data()){
                return { id: doc.id, ...doc.data() } ;
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo buscar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async getAll() {
        try{
            const snapshot = await this.collection.get();
            const respuestas = Array();
            snapshot.forEach(doc => {
                respuestas.push({ id: doc.id, ...doc.data() })
            })
            if(respuestas){
                return respuestas;
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo obtener los datos de la tabla ',this.tabla,' de la base de datos: ',err);
        }
    }

    async save(item) {
        try{
            const guardado = await this.collection.add(item);
            if(guardado.id){
                return guardado.id;
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo grabar el dato en la tabla ',this.tabla,': ',err);
        }
    }

    async editById(num, item) {
        try{
            let respuesta = null;
            const doc = await this.collection.doc(num).get();
            if(doc.data()){
                await this.collection.doc(num).set(item).then((resultado) => {
                    if(resultado._writeTime){
                        item.id = num;
                        respuesta = item;
                    }
                }).catch(function(error) {
                    console.log(error);
                });
            }
            return respuesta;
        }catch(err){
            console.log('No se pudo modificar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async deleteById(num) {
        try{
            let respuesta = false;
            const doc = await this.collection.doc(num).get();
            if(doc.data()){
                await this.collection.doc(num).delete().then((resultado) => {
                    if(resultado._writeTime){
                        respuesta = true
                    }
                }).catch(function(error) {
                    console.log(error);
                });
            }
            return respuesta;
        }catch(err){
            console.log('No se pudo modificar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async deleteAll(){
        try{
            await this.collection.get().then(querySnapshot => {
                querySnapshot.docs.forEach(snapshot => {
                    snapshot.ref.delete();
                })
            })
        }catch(err){

        }
    }
}