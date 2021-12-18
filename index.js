const moment = require('moment');  
const normalizr = require('normalizr');
const normalize = normalizr.normalize;
const schemaNormalizr = normalizr.schema;

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const handlebars = require("express-handlebars");
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const {Router} = express;

const {DBdefault, inicializarTablas} = require('./config.js');
(async() => {
    await inicializarTablas(DBdefault);
})();

global.Ruta = Router;
global.admin = true;
global.carritoId = null;

const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const objchat = require('./clases/Chat.js');

const chat = new objchat();

const productosApi = require('./api/productosApi.js');
const productoTestsApi = require('./api/productosTestApi.js');
const carritoApi = require('./api/carritoApi.js');
const indexView = require('./index_views.js');

app.use(express.static('./public'));

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/partials/"
    })
);

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://admin:1234@cluster0.8mbng.mongodb.net/mibase?retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    }),
    secret: 'codercasa',
    resave: false,
    saveUninitialized: false ,
    cookie: {
        maxAge: 60000*10
    } 
}));

app.post('/login',(req, res)=>{
    if (!req.session.usuario) {
        req.session.usuario=req.body.usuario;
    }
    res.send(`{"mensajeExito":"usuario logueado","usuario":"${req.session.usuario}"}`);
});

app.get('/logout', (req, res) => {
    if (req.session.usuario) {
        let usuario = req.session.usuario;
        req.session.destroy(err => {
            if (!err) res.render('logout.hbs',{usuario: usuario});
            else res.send(`{"mensajeError":"no se pudo deslogear al usuario"}`)
        })
    }else{
        res.redirect(`/productos`);
    }
})

io.on('connection', (socket) => { 
    socket.on('grabarMensaje', data => {
        (async() => {
            data = JSON.parse(data);
            data.fecha = Date();
            await chat.save(data);
            let ahora = moment().format('DD/MM/YYYY HH:mm:ss');
            data.fecha = ahora;
            io.sockets.emit('mensajeNuevo', JSON.stringify(data));
          })();
    })

    socket.on('recuperarMensajes',data  => {
        (async() => {
            let todos = await chat.getAll();
            if(todos.length>0){
                const schemaAutor = new schemaNormalizr.Entity('autor',{},{idAttribute:'mail'});
                const schemaMensaje = new schemaNormalizr.Entity('mensaje',{autor: schemaAutor});
                const schemaMensajes = new schemaNormalizr.Entity('mensajes',{mensajes: [schemaMensaje]});
    
                const mensajes = normalize({id:'999',mensajes:todos},schemaMensajes);
                socket.emit('mensajesAnteriores',mensajes);
            }
        })();
    })
  
    socket.on('notificacion', data => {
      console.log(data);
    })
});

app.use('/',indexView);
app.use('/api/productos', productosApi);
app.use('/api/productos-test', productoTestsApi);
app.use('/api/carrito', carritoApi);

app.use((req, res, next) => {
    res.send(`{ "error" : -1, "descripcion": "ruta ${req.url} método ${req.method} no existe"}`);
});

httpServer.listen(8080, () => console.log('SERVER ON')) // El servidor funcionando en el puerto 3000
httpServer.on('error', (err) =>console.log(err));