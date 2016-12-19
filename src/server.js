// run me with:
// node server.js
var blind = require('./blind.js');
var http = require('http');

const PORT=8080; 

function handleRequest(req, res){
  var html = buildHtml(req);
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': html.length,
    'Expires': new Date().toUTCString()
  });
  res.end(html);
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});

function buildHtml(req) {
  var header = "<meta id=\"captcha-bypass\">";
  var body = 'stuff';
  return '<!DOCTYPE html>'
       + '<html><head>' + header + '</head><body>' + body + '</body></html>';
};
