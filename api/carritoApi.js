const apiCarrito = new Ruta();
const carrito = require('../clases/carrito.js');
const carrApi = new carrito();

apiCarrito.post('/',(req, res)=>{
    (async() => {
        let nuevo = await carrApi.create();
        if(nuevo){
            res.send(`{"mensajeExito":"Carrito creado","itemNuevo":${nuevo}}`);
        }else{
            res.send(`{"mensajeError":"No se creo el carrito"}`);
        }
      })();
})

apiCarrito.delete('/:id',(req, res)=>{
    (async() => {
        let buscado = await carrApi.getById(req.params.id);
        if(buscado){
            await carrApi.deleteById(req.params.id);
            res.send(`{"mensajeExito":"Carrito borrado"}`);
        }else{
            res.send(`{"mensajeError":"No se borrar el carrito"}`);
        }
      })();
})

apiCarrito.get('/:id/productos',(req, res)=>{
    (async() => {
        let buscado = await carrApi.getProductsById(req.params.id);
        if(buscado){
            res.send(JSON.stringify(buscado));
        }else{
            res.send(`{"mensajeError":"No exite dicho carrito"}`);
        }
      })();
})

apiCarrito.post('/:id/productos',(req, res)=>{
    (async() => {
        let resultado = await carrApi.addProduct(req.params.id,req.body);
        if(resultado.status === 1){
            res.send(`{"mensajeExito":"Producto ${req.body.id} fue agregado al carrito ${req.params.id}"}`);
        }else{
            res.send(`{"mensajeError":"${resultado.mensaje}"}`);
        }
      })();

})

apiCarrito.delete('/:id/productos/:producto',(req, res)=>{
    (async() => {
        let resultado = await carrApi.deleteProduct(req.params.id,req.params.producto);
        if(resultado.status === 1){
            res.send(`{"mensajeExito":"Producto ${req.params.producto} fue borrado del carrito ${req.params.id}"}`);
        }else{
            res.send(`{"mensajeError":"${resultado.mensaje}"}`);
        }
      })();

})

apiCarrito.get('/',(req, res)=>{
    (async() => {
        let todos = await carrApi.getAll();
        if(todos){
            res.send(JSON.stringify(todos));
        }else{
            res.send(`{"mensajeError":"No hay carritos"}`);
        }
      })();
})

module.exports = apiCarrito;