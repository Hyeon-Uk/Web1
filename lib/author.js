var db = require('./db');
var fs = require('fs');
var template = require('./template');
var qs = require('querystring');
var url=require(`url`);
exports.home = function (request, response) {
    db.query(`SELECT * FROM topic`, function (err, topics) {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM author`, function (err2, authors) {
            if (err2) {
                throw err2;
            }
            var title = "author";
            var tag = template.authorTable(authors);

            var list = template.list(topics);

            fs.readFile(`./style.css`, 'utf8', function (err, _css) {
                var html = template.HTML(title, _css, list,
                    `
                    ${tag}
                    <style>
                        table{
                            border-collapse:collapse;
                        }
                        td{
                            border:1px solid black;
                        }
                    </style>
                    <form action="/author/create_process" method="post">
                    <p>
                    <input type="text" placeholder="name" name="name">
                    </p>
                    <p>
                    <textarea name="profile" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                    </form>
                    `,
                    ``);
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

exports.create_process = function (request, response) {
    var body = "";
    request.on(`data`, function (data) {
        body += data;
    });
    request.on(`end`, function () {
        var post = qs.parse(body);
        var name = post.name;
        var profile = post.profile;
        db.query(`INSERT INTO author (name,profile) VALUES(?,?)`,
            [name, profile]
            , function (err, result) {
                if (err) {
                    throw err;
                }
                response.writeHead(302, { Location: `/author` });
                response.end();
            });
    });
}

exports.update = function (request, response) {
    var _url=request.url
    var queryData=url.parse(_url,true).query;
    db.query(`SELECT * FROM topic`, function (err, topics) {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM author`, function (err2, authors) {
            if (err2) {
                throw err2;
            }
            db.query(`SELECT * FROM author WHERE id=?`,[queryData.id], function (err3, author) {
                var title = "author";
                var tag = template.authorTable(authors);
                var list = template.list(topics);
                
                fs.readFile(`./style.css`, 'utf8', function (err, _css) {
                    var html = template.HTML(title, _css, list,
                        `
                    ${tag}
                    <style>
                        table{
                            border-collapse:collapse;
                        }
                        td{
                            border:1px solid black;
                        }
                    </style>
                    <form action="/author/update_process" method="post">
                    <p>
                    <input type="hidden" name="id" value="${queryData.id}">
                    </p>
                    <p>
                    <input type="text" placeholder="name" name="name" value="${author[0].name}">
                    </p>
                    <p>
                    <textarea name="profile" placeholder="profile">${author[0].profile}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                    </form>
                    `,
                        ``);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        });
    });
}


exports.update_process=function(request,response){
    var body = "";
    request.on(`data`, function (data) {
      body += data;
    });
    request.on(`end`, function () {
      var post = qs.parse(body);
      var id = post.id;
      var name = post.name;
      var profile = post.profile;
      db.query(`UPDATE author SET name=?,profile=? WHERE id=?`,
        [name,profile ,id],
        function (err, result) {
          response.writeHead(302, { Location: `/author` });
          response.end();
        }
      )
    });
}

exports.delete_process=function(request,response){
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      var id = post.id;
      db.query(`DELETE FROM topic WHERE id=?`, [id], function (err, result) {
        if (err) {
          throw err;
        }
        db.query(`DELETE FROM author WHERE id=?`,[id],function(err1,result1){
            response.writeHead(302, { Location: `/author` });
            response.end();
        });
      });
    });
}