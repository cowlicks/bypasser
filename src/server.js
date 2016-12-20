// run me with:
// node server.js
var blind = require('./blind.js');
var http = require('http');

const PORT=8080; 

function handleRequest(req, res){
  if (req.url == '/captcha-bypass') {
    captchaBypassHandler(req, res);
  } else {
    helloHandler(req, res);
  }
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});

function helloHandler(req, res) {
  var header = "<meta id=\"captcha-bypass\">";
  var body = 'stuff';
  var html = '<!DOCTYPE html>' + '<html><head>' + header + '</head><body>' + body + '</body></html>';
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': html.length,
    'Expires': new Date().toUTCString()
  });
  res.end(html);
}

// just echo for now
function captchaBypassHandler(req, res) {
  req.on('data', function(data) {
    var parsed = JSON.parse(data);
    res.end(data);
  });
}
