require('dotenv').config();

const optionsMysql ={
  client: 'mysql',
  connection:{
      host: process.env.mysqlHost,
      user: process.env.mysqlUser,
      password: process.env.mysqlPassword,
      database: process.env.mysqlDatabase
  }
}

const optionsSqlite3 = {
  client: 'sqlite3',
  connection: {
    filename: "./DB/ecommerce.sqlite"
  },
  useNullAsDefault: true
}

const optionsMongoDB = {
  url: process.env.mongodbUrl
}

const optionsFirebase = {
  conexion : {
    type: "service_account",
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.client_x509_cert_url
  }
}

 function inicializarTablas(db){
  (async() => {
    switch (db) {
        case 'archivoTexto':
            const ManejoArchivosclient = require('./clases/drivers/ManejoArchivos.js');
            await ManejoArchivosclient.inicializarTablas();
        break;
        case 'mysql':
            const MySQLclient = require('./clases/drivers/MySQLclient.js');
            await MySQLclient.inicializarTablas();
        break;
        case 'sqlite3':
            const SQLite3client = require('./clases/drivers/SQLite3client.js');
            await SQLite3client.inicializarTablas();
        break;
        case 'mongoDB':
            const MongoDBclient = require('./clases/drivers/MongoDBclient.js');
            await MongoDBclient.inicializarTablas();
        break;
        case 'firebase':
            const Firebaseclient = require('./clases/drivers/Firebaseclient.js');
            await Firebaseclient.inicializarTablas();
        break;
    }
})();
}

module.exports = {
    optionsMysql,
    optionsSqlite3,
    optionsMongoDB,
    optionsFirebase,
    inicializarTablas
};