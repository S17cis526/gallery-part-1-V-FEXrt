var fs = require('fs');

module.exports = {
  loadDir: loadDir,
  isCached: isCached,
  serveFiles: serve
}

var files = {};

function loadDir(directory){
  var items = fs.readdirSync(directory);
  items.forEach(function(item) {
    var path = directory + "/" + item;
    var stats = fs.statSync(path);
    if(stats.isFile()){
      var parts = path.split(".");
      var extension = parts[parts.length - 1];
      var type = 'application/octet-stream';
      switch(extension){
        case 'css':
          type = 'text/css';
          break;
        case 'js':
          type = 'text/javascript';
          break;
        case 'jpeg':
        case 'jpg':
          type = 'image/jpeg';
          break;
        case 'gif':
        case 'png':
        case 'bmp':
        case 'tiff':
          type = 'image/' + extension;
          break;
      }
      files[path] = {
        contentType: type,
        data: fs.readFileSync(path)
      };
    if(stats.isDirectory()){
      loadDir(path);
    }}
  });
}

function isCached(path){
  return files[path] != undefined;
}

function serve(path, req, res){
  res.statusCode = 200;
  res.setHeader('Content-Type', files[path].contentType);
  res.end(files[path].data);
}
