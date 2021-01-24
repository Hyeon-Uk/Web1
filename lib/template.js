module.exports={
    HTML:function (title,stylesheet, list, body, control) {
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB2 - ${title}</title>
        <meta charset="utf-8">
        <style>
        ${stylesheet}
        </style>
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <div id="grid">
        ${list}
        <div>
        ${control}
        ${body}
        </div>
        </div>
      </body>
      </html>
      `;
    },
    list:function (topics) {
      var list = `<ol>`;
      for (var i = 0; i < topics.length; i++) {
        list += `<li><a href='/?id=${topics[i].id}'>${topics[i].title}</a></li>`;
      }
      list += `</ol>`;
      return list;
    },
    authorSelect:function(authors,author_id){
      var tag=``;
      var selected=``;
      for(var author of authors){
        if(author.id==author_id){
          selected=` selected`;
        }
        else{
          selected=``;
        }
        tag+=`<option value='${author.id}'${selected}>${author.name}</option>`;
      }
      return `
      <select name="author">
      ${tag}
      </select>
      `;
    }
  }
