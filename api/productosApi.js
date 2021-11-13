const apiProductos = new Ruta();
const producto = require('../clases/productos.js');
const prod = new producto();

apiProductos.get('/',(req, res)=>{
    (async() => {
        let todos = await prod.getAll();
        if(todos){
            res.send(JSON.stringify(todos));
        }else{
            res.send(`{"mensajeError":"No hay productos"}`);
        }
      })();
})

apiProductos.get('/:id',(req, res)=>{
    (async() => {
        let buscado = await prod.getById(req.params.id);
        if(buscado){
            res.send(JSON.stringify(buscado));
        }else{
            res.send(`{"mensajeError":"No exite dicho producto"}`);
        }
      })();

})

apiProductos.post('/',(req, res)=>{
    if(admin){
        (async() => {
            let nuevo = await prod.save(req.body);
            if(nuevo){
                if(req.body.fromForm == 1){
                    res.redirect('/creado.html');
                }else{
                    res.send(`{"mensajeExito":"Producto creado","itemNuevo":${nuevo}}`);
                }
            }else{
                res.send(`{"mensajeError":"No se creo el producto"}`);
            }
          })();
    }else{
        res.send(`{ "error" : -1, "mensajeError": ruta / método POST no autorizada}`);
    }
})

apiProductos.put('/:id',(req, res)=>{
    if(admin){
        (async() => {
            let buscado = await prod.editById(req.params.id,req.body);
            if(buscado){
                res.send(JSON.stringify(buscado));
            }else{
                res.send(`{"mensajeError":"No exite dicho producto"}`);
            }
        })();
    }else{
        res.send(`{ "error" : -1, "mensajeError": "ruta /id método PUT no autorizada"}`);
    }
})

apiProductos.delete('/:id',(req, res)=>{
    if(admin){
        (async() => {
            let buscado = await prod.getById(req.params.id);
            if(buscado){
                await prod.deleteById(req.params.id);
                res.send(`{"mensajeExito":"Producto borrado"}`);
            }else{
                res.send(`{"mensajeError":"El producto que quiere borrar no existe"}`);
            }
        })();
    }else{
        res.send(`{ "error" : -1, "mensajeError": ruta /id método DELETE no autorizada}`);
    }
})

module.exports = apiProductos;