var mysql=require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'nodejs',
    password: '111111',
    database: 'opentutorials'
  });
  
  db.connect();

  module.exports=db;

  
  