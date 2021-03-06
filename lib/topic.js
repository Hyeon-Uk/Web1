var fs = require('fs');
var url = require('url');
var db = require('./db');
var template = require('./template');
var qs = require('querystring');
exports.home = function (request, response) {
    db.query(`SELECT * FROM topic`, function (error, topics) {
        var title = "Welcome";
        var description = "Hello, Node.js";
        var list = template.list(topics);

        fs.readFile(`./style.css`, 'utf8', function (err, _css) {
            var html = template.HTML(title, _css, list,
                `<h2>${title}</h2>${description}`,
                `<a href="/create">create</a>`);
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.page = function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    db.query(`SELECT * FROM topic`, function (err, topics) {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function (err2, topic) {
            if (err2) {
                throw err2;
            }
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topics);
            fs.readFile(`./style.css`, 'utf8', function (err, _css) {
                var html = template.HTML(title, _css, list,
                    `<h2>${title}</h2>${description}
              <p>by ${topic[0].name}</p>
              `,
                    ` <a href="/create">create</a>
              <a href="/update?id=${queryData.id}">update</a>
              <form action="delete_process" method="post" onsubmit="return confirm('really?')" style="display:inline-block">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
              </form>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

exports.create = function (request, response) {
    db.query(`SELECT * FROM topic`, function (err, topics) {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM author`, function (err2, authors) {
            if (err2) {
                throw err2;
            }
            var title = "WEB - create";
            var list = template.list(topics);
            var tag = template.authorSelect(authors);
            fs.readFile(`./style.css`, 'utf8', function (err, _css) {
                var html = template.HTML(title, _css, list, `
          <h2>${title}</h2>
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              ${tag}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '');
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
        var title = post.title;
        var description = post.description;
        var author = post.author;
        db.query(`INSERT INTO topic (title,description,created,author_id) VALUES(?,?,NOW(),?)`,
            [title, description, author]
            , function (err, result) {
                if (err) {
                    throw err;
                }
                response.writeHead(302, { Location: `/?id=${result.insertId}` });
                response.end();
            });
    });
}

exports.update = function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    db.query(`SELECT * FROM topic`, function (err, topics) {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (err2, topic) {
            if (err2) {
                throw err2;
            }
            db.query(`SELECT * FROM author`, function (err3, authors) {
                if (err3) {
                    throw err3;
                }
                var list = template.list(topics);
                var title = topic[0].title;
                var description = topic[0].description;
                var tag = template.authorSelect(authors, topic[0].author_id);
                fs.readFile(`./style.css`, 'utf8', function (err, _css) {
                    var html = template.HTML(title, _css, list,
                        `
              <h2>Web - update</h2>
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                  <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                  ${tag}
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
                        `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
                    );
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
      var title = post.title;
      var description = post.description;
      var author=post.author;
      db.query(`UPDATE topic SET title=?,description=?,author_id=? WHERE id=?`,
        [title, description,author ,id],
        function (err, result) {
          response.writeHead(302, { Location: `/?id=${id}` });
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
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
}