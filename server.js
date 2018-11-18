const http = require('http');
const fs = require('fs');

console.log(`${__dirname}/index.html`)

http.createServer((req, res) => {
  if(req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    let index = fs.createReadStream(`${__dirname}/index.html`);
    index.on('open', () => index.pipe(res));
    index.on('error', function(err) {
      res.end(err);
    });
  } else if(req.url === '/styles.css') {
    res.writeHead(200, {'Content-Type': 'text/css'});
    let css = fs.createReadStream(`${__dirname}/styles.css`);
    css.on('open', () => css.pipe(res));
    css.on('error', function(err) {
      res.end(err);
    });
  } else if(req.url === '/index.js') {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    let js = fs.createReadStream(`${__dirname}/index.js`);
    js.on('open', () => js.pipe(res));
    js.on('error', function(err) {
      res.end(err);
    });
  }
}).listen(8000);