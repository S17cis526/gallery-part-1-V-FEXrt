/**
 * @module multipart
 * A module for processing multipart HTTP requests
 */

"use strict;"

module.exports = multipart;

const DOUBLE_CRLF = Buffer.from([0x0D, 0x0A,0x0D, 0x0A]);

/**
 * @function multipart
 * Takes z request and response object
 * parses the body of the multipart requests
 * and attaches its contents to the request object.
 * If error occurs, we log it and send a 500
 * status code, Otherwise
 * we invoke next with request and response
 * @param request
 * @param response
 */
function multipart(req, res, next) {
  var chunks = [];

  req.on('error', (err) =>{
    console.error(err);
    res.statusCode = 500;
    res.end();
  });

  res.on('data', (chunk) => {
    chunks.push(chunk);
  });

  res.on('end', () => {
    var boundry = req.headers["contentType"];
    var buffer = Buffer.concat(chunks);
    processBody(buffer, boundary);
  });

}

/**
 * @function processBody
 * Takes a buffer and a boundary and
 * returns an associative array of
 * key/value pairs; if content is a file,
 * value will be an object with filename,
 * contentType, and data
 * @param buffer
 * @param boundary
 */
function processBody(buffer, boundary) {
  var contents = [];

  var start = buffer.indexOf(boundary) + boundary.length + 2;
  var end = buffer.indexOf(boundary, start);

  while(end > start){
    contents.push(buffer.slice(start, end));

    start = end + boundary.length + 2;
    end = buffer.indexOf(boundary, start);
  }

  var parsedContents = {};
  contents.foreach((c) => {
    parseContent(c, (err, tuple) => {
      if(err){
        if(err) return console.error(err);

        parseContent[tuple[0]] = tuple[1];
      }
    });
  });

  return parseContents;
}

/**
 * @function parseContent
 * Parses a content section and return
 * the key/value pair as a two-element array
 */
function parseContent(content, callback){
  var index = content.indexOf(DOUBLE_CRLF);
  var head = content.slice(0, index).toString();
  var body = content.slice(index + 4);

  var name = /name="([\w\d\-_]+)"/.exec(head)
  var filename = /filename="([\w\d\-_\.]+)"/.exec(head)
  var contentType = /Content-Type: ([\w\d\/]+)/.exec(head)

  if(!name) return callback("Content without name");

  if(filename){
    // we has file
    callback(false, [name[1], {
      filename: filename[1],
      contentType: (contentType) ? contentType[1] : 'application/octet-stream',
      data: body
    }]);
  }
  else{
    // we have a value
    callback(false, [name[1], body.toString()]);
  }

}
