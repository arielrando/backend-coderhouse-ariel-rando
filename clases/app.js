const moment = require('moment');  
const normalizr = require('normalizr');
const normalize = normalizr.normalize;
const schemaNormalizr = normalizr.schema;
const path = require('path');

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const handlebars = require("express-handlebars");
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const bCrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const usuarios = require('./Usuarios.js');
const userObj = new usuarios();

passport.use(
    'signup',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField:'unsernameRegistro',
        passwordField:'passwordRegistro'
      },
      (req, email, pass, done) => {
        (async() => {
          try {
            let user = await userObj.getCustom([{fieldName: 'email', value: email}],1);

            if (user[0]) {
              console.log('el usuario ya existe!')
              return done(null, false)
            }

            let newUser = {
              email: email,
              password: createHash(pass)
            }

            let createdUser = await userObj.save(newUser);

            if(!createdUser){
              throw "error al crear el usuario";
            }

            return done(null, createdUser);

          } catch (err) {
            console.log('Error al hacer el registro: ' + err)
            return done(err)
          }
          
        })();
      }
    )
  )

  passport.use(
    'login',
    new LocalStrategy((username, password, done) => {
      (async() => {
        try {
          let user = await userObj.getCustom([{fieldName: 'email', value: username}],1);

          if (!user[0]) {
            console.log('el usuario no existe!');
            return done(null, false);
          }

          if (!isValidPassword(user[0], password)) {
            console.log('contraseña invalida!');
            return done(null, false);
          }
    
          return done(null, user[0].id);

        } catch (err) {
          console.log('Error al hacer el login: ' + err)
          return done(err)
        }
      })();
    })
  )
  
  passport.deserializeUser((id, done) => {
    (async() => {
      let user = await userObj.getById(id);
      if(!user){
        return done('no se encontro el usuario', null)
      }else{
        return done(null, user);
      }
    })();
  })
  
  passport.serializeUser((idUser, done) => {
    done(null, idUser)
  })
  
  function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password)
  }
  
  function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
  } 

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const objchat = require('./Chat.js');

const chat = new objchat();

app.use(express.static(path.join(__dirname,'../public')));

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: path.join(__dirname,"../views/layouts"),
        partialsDir:path.join(__dirname,"../views/partials/")
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

app.use(passport.initialize());
app.use(passport.session());

app.post('/login',passport.authenticate('login', { failureRedirect: 'users/falloLogin' }),(req, res)=>{
    //res.send(`{"mensajeExito":"usuario logueado","usuario":"${req.user}"}`);
    res.redirect(`/`);
});

app.post('/registro', passport.authenticate('signup', { failureRedirect: 'users/falloRegistro' }),(req, res) => {
    res.redirect(`users/exitoRegistro`);
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

module.exports = {
    app,
    httpServer,
    io
};