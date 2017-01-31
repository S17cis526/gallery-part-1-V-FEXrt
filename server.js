"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
var http = require('http');
var fs = require('fs');
var port = 3000;

var stylesheet = fs.readFileSync('gallery.css');

var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg'];

function serveImage(filename, req, res){
  fs.readFile('images/' + filename, (err, body) => {
    if(err){
      console.error(err);
      res.statusCode = 500;
      res.statusMessage = 'Server Error';
      res.end('Ooooooops');
      return;
    }

    res.setHeader('Content-Type', 'image/jpeg');
    res.end(body);
  });
}

var server = http.createServer((req, res) => {

  switch (req.url) {
    case '/gallery':
      var gHtml = imageNames.map((name) => {
        return '<img src="' + name + '" alt="a fishing ace at work">'
      }).join();

      var html =  '<!doctype html>';
          html += '<head>';
          html += ' <title>Dynamic Page</title>';
          html += ' <link href="gallery.css" rel="stylesheet" type="text/css">';
          html += '</head>';
          html += '<body>';
          html += '<h1>Gallery</h1>'
          html += gHtml;
          html += '</body>';

      res.setHeader('Content-Type', 'text/html');
      res.end(html);
      break;
    case '/chess':
    case '/chess/':
    case '/chess.jpg':
    case '/chess.jpg/':
      serveImage('chess.jpg', req, res);
      break;
    case '/fern':
    case '/fern/':
    case '/fern.jpg':
    case '/fern.jpg/':
      serveImage('fern.jpg', req, res);
      break;
    case '/ace.jpg':
      serveImage('ace.jpg', req, res);
      break;
    case '/bubble.jpg':
      serveImage('bubble .jpg', req, res);
      break;
    case '/gallery.css':
      res.setHeader('Content-Type', 'text/css');
      res.end(stylesheet);
      break;
    default:
      res.statusCode = 404;
      res.statusMessage = 'File Not Found';
      res.end();
      break;
  }
});

server.listen(port, () => {
  console.log("Listening on Port " + port);
});
