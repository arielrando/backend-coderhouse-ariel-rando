/* archivoTexto - mysql - mongoDB - firebase*/
const DBdefault = 'archivoTexto';

const optionsMysql ={
  client: 'mysql',
  connection:{
      host: '127.0.0.1',
      user: 'root',
      password: '1234',
      database: 'backend'
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
  url: "mongodb://127.0.0.1:27017/mibase?directConnection=true&serverSelectionTimeoutMS=2000"
}

const optionsFirebase = {
  conexion : {
    type: "service_account",
    project_id: "curso-backend",
    private_key_id: "INGRESAR DATOS PROPIOS O PEDIR AL PROPIETARIO",
    private_key: "INGRESAR DATOS PROPIOS O PEDIR AL PROPIETARIO",
    client_email: "firebase-adminsdk-kmm6v@curso-backend.iam.gserviceaccount.com",
    client_id: "INGRESAR DATOS PROPIOS O PEDIR AL PROPIETARIO",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kmm6v%40curso-backend.iam.gserviceaccount.com"
  }
}

module.exports = {
    DBdefault,
    optionsMysql,
    optionsSqlite3,
    optionsMongoDB,
    optionsFirebase
};