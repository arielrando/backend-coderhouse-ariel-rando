const moment = require('moment');  
const express = require('express');
const handlebars = require("express-handlebars");
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const {Router} = express;

const {DBdefault} = require('./config.js');
(async() => {
    switch (DBdefault) {
        case 'archivoTexto':
            const ManejoArchivosclient = require('./clases/manejadores/ManejoArchivos.js');
            await ManejoArchivosclient.inicializarTablas();
        break;
        case 'mysql':
            const MySQLclient = require('./clases/manejadores/MySQLclient.js');
            await MySQLclient.inicializarTablas();
        break;
        case 'sqlite3':
            const SQLite3client = require('./clases/manejadores/SQLite3client.js');
            await SQLite3client.inicializarTablas();
        break;
        case 'mongoDB':
            const MongoDBclient = require('./clases/manejadores/MongoDBclient.js');
            await MongoDBclient.inicializarTablas();
        break;
        case 'firebase':
            const Firebaseclient = require('./clases/manejadores/Firebaseclient.js');
            await Firebaseclient.inicializarTablas();
        break;
    }
})();

global.Ruta = Router;
global.admin = true;
global.carritoId = null;

const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const producto = require('./clases/Productos.js');
const carrito = require('./clases/Carrito.js');
const objchat = require('./clases/Chat.js');

const prod = new producto();
const chat = new objchat();
const carr = new carrito();

const productosApi = require('./api/productosApi.js');
const carritoApi = require('./api/carritoApi.js');

app.use(express.static('./public'));

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "views/partials/"
    })
);

app.get('/',(req, res) => {
    res.redirect(`/productos`);
})

app.get('/productos',(req, res) => {
    (async() => {
        let todos = await prod.getAll();
        let hayProductos = false;
        let mensaje = null;
        if(todos.length>0){
            hayProductos = true;
        }
        if(!carritoId){
            carritoId = await carr.create();
        }
        res.render('products_list.hbs',{productList: todos, hayProductos: hayProductos, mensaje: mensaje, admin: admin, carritoId: carritoId});
      })();
})

app.get('/modificar/:id',(req, res) => {
    (async() => {
        let buscado = await prod.getById(req.params.id);
        if(buscado){
            res.render('products_form.hbs',{product: buscado, id: req.params.id});
        }else{
            res.redirect(`/productos`);
        }
      })();
    
})

app.get('/carrito',(req, res) => {
    (async() => {
        let carrito = await carr.getProductsById(carritoId);
        let hayProductos = false;
        if(carrito && carrito.length>0){
            hayProductos = true;
        }
        res.render('products_carrito.hbs',{carrito: carrito, carritoId:carritoId, hayProductos: hayProductos});
      })();
})

app.get('/instrucciones_api',(req, res) => {
    res.render('instrucciones_api.hbs');
});

io.on('connection', (socket) => { 
    socket.on('grabarMensaje', data => {
        (async() => {
            data = JSON.parse(data);
            if(DBdefault!='mysql'){
                data.fecha = Date();
            }
            await chat.save(data);
            let ahora = moment().format('DD/MM/YYYY HH:mm:ss');
            data.fecha = ahora;
            io.sockets.emit('mensajeNuevo', JSON.stringify(data));
          })();
    })
  
    socket.on('notificacion', data => {
      console.log(data);
    })
});

app.use('/api/productos', productosApi);
app.use('/api/carrito', carritoApi);

app.use((req, res, next) => {
    res.send(`{ "error" : -1, "descripcion": "ruta ${req.url} método ${req.method} no existe"}`);
});

httpServer.listen(8080, () => console.log('SERVER ON')) // El servidor funcionando en el puerto 3000
httpServer.on('error', (err) =>console.log(err));