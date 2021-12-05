const DBdefault = 'mysql';

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

module.exports = {
    DBdefault,
    optionsMysql,
    optionsSqlite3,
    optionsMongoDB
};