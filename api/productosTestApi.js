const apiProductosTest = new Ruta();
const producto = require('../clases/productos.js');
const prod = new producto();

apiProductosTest.get('/',(req, res)=>{
    (async() => {
        let todos = prod.getRandoms();
        if(todos.length>0){
            res.send(JSON.stringify(todos));
        }else{
            res.send(`{"mensajeError":"No hay productos"}`);
        }
      })();
})


module.exports = apiProductosTest;