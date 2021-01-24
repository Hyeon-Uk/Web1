var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port:3307,
    user: 'nodejs',
    password: '111111',
    database: 'opentutorials'
});

connection.connect();

connection.query(`select * from topic;`, function (err, results, fields) {
    if (err) {
        console.log(err);
    }
    console.log(results);
});

connection.end();