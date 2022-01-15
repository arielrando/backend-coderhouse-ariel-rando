const indexView = new Ruta();
const producto = require('./clases/Productos.js');
const carrito = require('./clases/Carrito.js');

const prod = new producto();
const carr = new carrito();

indexView.get('/',(req, res) => {
    res.redirect(`/productos`);
})

indexView.get('/productos',(req, res) => {
    (async() => {
        let todos = await prod.getAll();
        let hayProductos = (todos.length>0)?true:false;
        if(!carritoId){
            carritoId = await carr.create();
        }
        res.render('products_list.hbs',{productList: todos, hayProductos: hayProductos, usuarioLogin: req.user, admin: admin, carritoId: carritoId});
      })();
})

indexView.get('/productos-test',(req, res) => {
    (async() => {
        const productosFalsos = prod.getRandoms();

        if(!carritoId){
            carritoId = await carr.create();
        }
        res.render('products_list.hbs',{productList: productosFalsos, hayProductos: true, usuarioLogin: req.user,  admin: false, carritoId: carritoId, test:true});
      })();
})

indexView.get('/modificar/:id',(req, res) => {
    (async() => {
        let buscado = await prod.getById(req.params.id);
        if(buscado){
            res.render('products_form.hbs',{product: buscado, id: req.params.id, usuarioLogin: req.user});
        }else{
            res.redirect(`/productos`);
        }
      })();
})

indexView.get('/carrito',(req, res) => {
    (async() => {
        let carrito = await carr.getProductsById(carritoId);
        let hayProductos = false;
        if(carrito && carrito.length>0){
            hayProductos = true;
        }
        res.render('products_carrito.hbs',{carrito: carrito, carritoId:carritoId, hayProductos: hayProductos, usuarioLogin: req.user});
      })();
})

indexView.get('/instrucciones_api',(req, res) => {
    res.render('instrucciones_api.hbs',{usuarioLogin: req.user});
});

indexView.get('/info',(req, res) => {
    res.render('info.hbs',{argv:JSON.stringify(process.argv.slice(2)),ruta:process.cwd(),memory:JSON.stringify(process.memoryUsage()),process:process});
});

module.exports = indexView;