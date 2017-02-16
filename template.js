/* @module template
 *
 */
var fs = require('fs');
var templates = {};

module.exports = {
  render: render,
  loadDir: loadDir
}

/* @function loadDir
 * loads a directory of templates
 * @param {string} director = the directory to load
 */
function loadDir(directory) {
  var dirs = fs.readdirSync(directory);
  dirs.forEach((file) => {
    var path = directory + "/" + file; 
    var stats = fs.statSync(path);
    if(stats.isFile()){
      templates[file] = fs.readFileSync(path).toString();
    }
  });
}

/* @function render
 * Renders a template with embedded javascript
 * @param {string} templateName
 * @param {...}
 */ 
 function render(templateName, context){
   return templates[templateName].toString().replace(/<%=(.+)%>/g, (match, js) => {
     return eval("var context = " + JSON.stringify(context) + ";" + js);
   });
 }
