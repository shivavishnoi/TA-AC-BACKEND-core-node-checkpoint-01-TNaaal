var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var path = require('path');
var userDir = path.join(__dirname, 'contacts/');
var server = http.createServer(handleRequest);

function handleRequest(req, res) {
  var parsedUrl = url.parse(req.url);
  console.log(parsedUrl);
  var store = '';
  req.on('data', (chunk) => {
    store += chunk;
  });

  req.on('end', () => {
    //1
    if (req.method === 'GET' && req.url === '/') {
      fs.readFile('index.html', (err, content) => {
        res.setHeader('Content-Type', 'text/html');
        res.end(content);
      });
    }
    if (req.url.split('.').pop() === 'css') {
      res.setHeader('Content-Type', 'text/css');
      fs.readFile('.' + req.url, (err, content) => {
        res.end(content);
      });
    }
    if (req.url.split('.').pop() === 'png') {
      // console.log(req.url);
      res.setHeader('Content-Type', 'image/png');
      fs.readFile(req.url, (err, content) => {
        fs.createReadStream('.' + req.url).pipe(res);
      });
    }
    //2
    if (req.method == 'GET' && req.url == '/about') {
      fs.readFile('about.html', (err, content) => {
        res.setHeader('Content-Type', 'text/html');
        return res.end(content);
      });
    }
    //4
    if (req.method === 'GET' && req.url === '/contact') {
      fs.readFile('contact.html', (err, content) => {
        res.setHeader('content-Type', 'text/html');
        if (!err) {
          return res.end(content);
        }
      });
    }
    //5
    if (req.method === 'POST' && req.url === '/form') {
      var parsedData = qs.parse(store);
      var username = parsedData.username;
      fs.open(userDir + username + '.json', 'wx', (err, fd) => {
        if (err) {
          return res.end(`err while creating file as username taken`);
        }
        fs.writeFile(fd, JSON.stringify(parsedData), (err) => {
          if (err) {
            return res.end(`err while writing`);
          }
          fs.close(fd, (err) => {
            if (!err) {
              return res.end(`${username} is created`);
            }
          });
        });
      });
    }

    //Bonus
    // if (req.method === 'GET' && req.url === '/users') {
    //   var str = '';
    //   fs.readdir(__dirname + '/contacts', (err, files) => {
    //     files.forEach((file) => {
    //       fs.readFile(__dirname + '/contacts' + file, (err, content) => {
    //         str += content;
    //       });
    //     });
    //   });
    //   res.setHeader('Content-Type', 'text/plain');
    //   res.end(str);
    // }
    6
    if (req.method === `GET` && parsedUrl.pathname === `/users`) {
      var username = parsedUrl.query.split('=')[1];
      var filepath = userDir + username + '.json';
      console.log(filepath);
      fs.readFile(filepath, (err, content) => {
        if (err) {
          return res.end(`user not valid`);
        }
        res.setHeader('Content-Type', 'text/html');
        return res.end(`<h1>${content}</h1>`);
    //   });
    // }
  });
}

server.listen(5000, 'localhost', () => {
  console.log('server at 5k');
});
