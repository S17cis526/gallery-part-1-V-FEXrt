"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
var http = require('http');
var fs = require('fs');
var port = 3000;

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
