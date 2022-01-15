const bCrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const usuarios = require('./Usuarios.js');
const userObj = new usuarios();

function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password)
}

function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
} 

module.exports = function passportConfig(passport) {
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
} 