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

function getImageNames(callback){
  fs.readdir('images/', (err, filenames) => {
    if(err) { callback(err, null); }
    else { callback(null, filenames); }
  });
}

function imageNamesToTags(filenames) {
  return filenames.map((name) => {
    return `<img src="${name}" alt="${name}">`
  })
}

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

function buildGallery(imageTags){
    var html =  '<!doctype html>';
        html += '<head>';
        html += ' <title>Dynamic Page</title>';
        html += ' <link href="gallery.css" rel="stylesheet" type="text/css">';
        html += '</head>';
        html += '<body>';
        html += '<h1>Gallery</h1>'
        html += imageNamesToTags(imageTags).join('');
        html += '</body>';

    return html
}

function serveGallery(req, res) {
  getImageNames((err, names) => {
    if(err){
      console.error(err);
      res.statusCode = 404;
      res.statusMessage = 'Image gonzo'
      res.end();
      return;
    }

    res.setHeader('Content-Type', 'text/html');
    res.end(buildGallery(names));
  });
}

var server = http.createServer((req, res) => {

  switch (req.url) {
    case '/':
    case '/gallery':
      serveGallery(req, res);
      break;
    case '/gallery.css':
      res.setHeader('Content-Type', 'text/css');
      res.end(stylesheet);
      break;
    default:
      serveImage(req.url, req, res);
      break;
  }
});

server.listen(port, () => {
  console.log("Listening on Port " + port);
});
