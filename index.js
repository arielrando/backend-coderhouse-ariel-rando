const argv = require('minimist');
require('dotenv').config();
const express = require('express');
const cluster = require('cluster')
const {Router} = express;

const {inicializarTablas} = require('./config.js');
(async() => {
    await inicializarTablas(process.env.DBdefault);
})();

const numCPUs = require('os').cpus().length

global.Ruta = Router;
global.admin = true;
global.carritoId = null;

const optionsArgv = {
    default: {
        puerto: 8080,
        modo: 'FORK'
    },
    alias: {
        p: 'puerto',
        m: 'modo'
    }
}

const argumentos = argv(process.argv.slice(2),optionsArgv);

if (cluster.isPrimary && argumentos.modo=='CLUSTER') {
    console.log(numCPUs)
    console.log(`PID MASTER ${process.pid}`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })
}else {
    const productosApi = require('./api/productosApi.js');
    const productoTestsApi = require('./api/productosTestApi.js');
    const carritoApi = require('./api/carritoApi.js');
    const usersApi = require('./api/usersApi.js');
    const testApi = require('./api/testApi.js');
    const indexView = require('./index_views.js');

    const {app, httpServer, io} = require('./clases/app.js');

    app.use('/',indexView);
    app.use('/api/productos', productosApi);
    app.use('/api/productos-test', productoTestsApi);
    app.use('/api/carrito', carritoApi);
    app.use('/api/randoms', testApi);
    app.use('/users', usersApi);

    app.use((req, res, next) => {
        res.send(`{ "error" : -1, "descripcion": "ruta ${req.url} método ${req.method} no existe"}`);
    });

    httpServer.listen(argumentos.puerto, () => console.log(`SERVER ON ${argumentos.puerto} - PID ${process.pid} - ${new Date().toLocaleString()}`)) // El servidor funcionando en el puerto 3000
    httpServer.on('error', (err) =>console.log(err));
}