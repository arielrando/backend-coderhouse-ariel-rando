const express = require('express');
const {Router} = express;

const {DBdefault, inicializarTablas} = require('./config.js');
(async() => {
    await inicializarTablas(DBdefault);
})();

global.Ruta = Router;
global.admin = true;
global.carritoId = null;

const productosApi = require('./api/productosApi.js');
const productoTestsApi = require('./api/productosTestApi.js');
const carritoApi = require('./api/carritoApi.js');
const usersApi = require('./api/usersApi.js');
const indexView = require('./index_views.js');

const {app, httpServer, io} = require('./clases/app.js');

app.use('/',indexView);
app.use('/api/productos', productosApi);
app.use('/api/productos-test', productoTestsApi);
app.use('/api/carrito', carritoApi);
app.use('/users', usersApi);

app.use((req, res, next) => {
    res.send(`{ "error" : -1, "descripcion": "ruta ${req.url} método ${req.method} no existe"}`);
});

httpServer.listen(8080, () => console.log('SERVER ON')) // El servidor funcionando en el puerto 3000
httpServer.on('error', (err) =>console.log(err));