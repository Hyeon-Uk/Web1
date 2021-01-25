var mysql=require('mysql');
var db = mysql.createConnection({
    host: '',
    port: 3307,
    user: '',
    password: '',
    database: ''
  });
  
  db.connect();

  module.exports=db;

  
  