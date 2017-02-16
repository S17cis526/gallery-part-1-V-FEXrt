"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
var http = require('http');
var fs = require('fs');
var url = require('url');
var port = 3000;
var template = require('./template');

var stylesheet = fs.readFileSync('gallery.css');
var config = JSON.parse(fs.readFileSync('config.json'));

template.loadDir("templates");

var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg'];

function getImageNames(callback){
  fs.readdir('images/', (err, filenames) => {
    if(err) { callback(err, null); }
    else { callback(null, filenames); }
  });
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
   return template.render('gallery.html', {
     title: config.title,
     filenames: imageTags 
   });
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

function uploadImage(req, res){
  var body='';
  req.on('error', () => {
    res.statusCode = 500;
    res.end();
  });
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    fs.writeFile('filename', body, (err) =>{
      if(err){
        console.error(err);
        res.statusCode = 500;
        res.end();
        return
      }

      serveGallery(req, res);
    });
  });
}

var server = http.createServer((req, res) => {
  //var url = req.url.split('?');
  //var resource = url[0];
  //var queryString = url[1];

  var urlParts = url.parse(req.url);

  if(urlParts.query){
    var matches = /title=(.+)($|&)/.exec(urlParts.query);
    if(matches && matches[1]){
      config.title = decodeURIComponent(matches[1]);
      fs.writeFile('config.json', JSON.stringify(config));
    }
  }

  switch (urlParts.pathname) {
    case '/':
    case '/gallery':
      serveGallery(req, res);
      break;
    case '/gallery.css':
        if(req.method == "GET"){
          res.setHeader('Content-Type', 'text/css');
          res.end(stylesheet);
        }
        if(req.method == "POST"){
          uploadImage(req, res);
        }

      break;
    default:
      serveImage(urlParts.pathname, req, res);
      break;
  }
});

server.listen(port, () => {
  console.log("Listening on Port " + port);
});
