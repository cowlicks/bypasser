// run me with:
// node server.js
var blind = require('./blind.js');
var keys = require('./keys.js');
var BN = require('../lib/bn.js');
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

function captchaBypassHandler(req, res) {
  req.on('data', function(data) {
    var parsed = JSON.parse(data);
    var sigs = sign(parsed);
    var out = JSON.stringify({"sigs":sigs});
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': out.length,
    });
    res.end(out);
  });
}

function sign(parsed) {
  console.log(parsed);
  var tokens = parsed['tokens'];
  var sigs = {};
  for (i = 0; i < tokens.length; i++) {
    blinded = tokens[i];
    number = new BN.BN(blinded);
    console.log(blind);
    signedarr = blind.BlindSign(keys.GetKey(), number.toArray());
    sig = new BN.BN(signedarr).toString();
    console.log(sig);
    sigs[blinded] = new BN.BN(signedarr).toString();
  }
  return sigs;
}
