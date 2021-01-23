var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

//make templateHTML function
function templateHTML(title, list, body, control) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `
}

//make list function
function templateList(filelist) {
  var list = `<ul>`;
  for (var i = 0; i < filelist.length; i++) {
    list += `<li><a href='/?id=${filelist[i]}'>${filelist[i]}</a></li>`;
  }
  list += `</ul>`;
  return list;
}

//run
var app = http.createServer(function (request, response) {
  var _url = request.url;//infomation about url
  var queryData = url.parse(_url, true).query;//information about query string data
  var pathname = url.parse(_url, true).pathname;//information about pathname

  console.log(pathname);
  if (pathname === '/') {
    //index page
    if (queryData.id === undefined) {
      fs.readdir(`./data`, function (err, filelist) {
        var list = templateList(filelist);
        var title = `Welcome`;
        var data = `Hello Node.js`;

        var template = templateHTML(title, list, `<h2>${title}</h2>${data}`, '');
        response.writeHead(200);
        response.end(template);
      });
    }
    //another page
    else {
      fs.readdir(`./data`, function (err, filelist) {
        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var list = templateList(filelist);

          var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`
            ,
            `
          <a href='/creat'>create</a>
          <a href='/update?id=${queryData.id}'>update</a>
          `);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  }
  //to make article page
  else if (pathname === `/create`) {
    fs.readdir(`./data`, function (err, filelist) {
      var list = templateList(filelist);
      var title = "WEB - create";

      var template = templateHTML(title, list, `
        <form action="/create_process" method="POST">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
          <textarea name="description" placeholder="description"></textarea>
          </p>
          <input type="submit">
        </form>
      `,
        `
        <a href='/creat'>create</a>
        <a href='/update'>update</a>
      `);
      response.writeHead(200);
      response.end(template);
    });
  }
  //make file about inserting data
  else if (pathname === `/create_process`) {
    var body = "";
    request.on(`data`, function (data) {
      body += data;
    });
    request.on(`end`, function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;

      fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  }
  //update
  else if (pathname === `/update`) {
    fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
      fs.readdir(`./data`, function (err, filelist) {
        var list = templateList(filelist);
        var title = queryData.id;

        var template = templateHTML(title, list, `
        <form action="/update_process" method="POST">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
          <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <input type="submit">
        </form>
      `,` `);
        response.writeHead(200);
        response.end(template);
      });
    });
  }
  else if(pathname===`/update_process`){
    var body="";
    request.on(`data`,function(data){
      body+=data;
    });
    request.on(`end`,function(){
      var post=qs.parse(body);
      var id=post.id;
      var title=post.title;
      var description=post.description;
      fs.rename(`data/${id}`,`data/${title}`,function(){
        fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
      });
    })
  }
  else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(8000);