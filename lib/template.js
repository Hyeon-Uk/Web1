module.exports = {
  HTML: function (title, stylesheet, list, body, control) {
    return `
      <!doctype html>
      <html>
      <head>
        <title>WEB2 - ${title}</title>
        <link rel="shortcut icon" href="https://www.youtube.com/s/desktop/b70e86a1/img/favicon.ico" type="image/x-icon">
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
        <a href="/author">author</a>
        ${control}
        ${body}
        </div>
        </div>
      </body>
      </html>
      `;
  },
  list: function (topics) {
    var list = `<ol>`;
    for (var i = 0; i < topics.length; i++) {
      list += `<li><a href='/?id=${topics[i].id}'>${topics[i].title}</a></li>`;
    }
    list += `</ol>`;
    return list;
  },
  authorSelect: function (authors, author_id) {
    var tag = ``;
    var selected = ``;
    for (var author of authors) {
      if (author.id == author_id) {
        selected = ` selected`;
      }
      else {
        selected = ``;
      }
      tag += `<option value='${author.id}'${selected}>${author.name}</option>`;
    }
    return `
      <select name="author">
      ${tag}
      </select>
      `;
  },
  authorTable: function (authors) {
    var tag = '<table>';
    var i = 0;
    while (i < authors.length) {
      tag += `
                <tr>
                    <td>${authors[i].name}</td>
                    <td>${authors[i].profile}</td>
                    <td><a href='/author/update?id=${authors[i].id}'>update</a></td>
                    <td>
                    <form action='/author/delete_process' method='POST'>
                    <input type='hidden' name='id' value='${authors[i].id}'>
                    <input type='submit' value='delete'>
                    </form>
                    </td>
                </tr>
                `
      i++;
    }
    tag += `</table>`;
    return tag;
  }
}
