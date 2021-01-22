var http = require('http');
var fs = require('fs');
var url = require('url');
var qs=require('querystring');

//make templateHTML function
function templateHTML(title,list,body){
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
    <a href="/create">create</a>
    ${body}
  </body>
  </html>
  `
}

//make list function
function templateList(filelist){
  var list=`<ul>`;
  for(var i=0;i<filelist.length;i++){
    list+=`<li><a href='/?id=${filelist[i]}'>${filelist[i]}</a></li>`;
  }
  list+=`</ul>`;
  return list;
}

//run
var app = http.createServer(function (request, response) {
  var _url = request.url;//infomation about url
  var queryData = url.parse(_url, true).query;//information about query string data
  var pathname=url.parse(_url,true).pathname;//information about pathname

  console.log(pathname);
  if(pathname==='/'){
    //index page
    if(queryData.id===undefined){
      fs.readdir(`./data`,function(err,filelist){
        var list=templateList(filelist);
        var title=`Welcome`;
        var data=`Hello Node.js`;

        var template=templateHTML(title,list,`<h2>${title}</h2>${data}`);
        console.log(template);
        response.writeHead(200);
        response.end(template);
      });
    }
    //another page
    else{
      fs.readdir(`./data`,function(err,filelist){
        fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
          var title=queryData.id;
          var list=templateList(filelist);
          
          var template=templateHTML(title,list,`<h2>${title}</h2><p>${description}</p>`);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  }
  //to make article page
  else if(pathname===`/create`){
    fs.readdir(`./data`,function(err,filelist){
      var list=templateList(filelist);
      var title="WEB - create";

      var template=templateHTML(title,list,`
        <form action="http://localhost:8000/create_process" method="POST">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
          <textarea name="description" placeholder="description"></textarea>
          </p>
          <input type="submit">
        </form>
      `);
      response.writeHead(200);
      response.end(template);
    });
  }
  //make file about inserting data
  else if(pathname===`/create_process`){
    var body="";
    request.on(`data`,function(data){
      body+=data;
    });
    request.on(`end`,function(){
      var post=qs.parse(body);
      var title=post.title;
      var description=post.description;

      fs.writeFile(`data/${title}`,description,'utf8',function(err){
        response.writeHead(302,{Location:`/?id=${title}`});
        response.end();
      });
    });
  }
  else{
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(8000);