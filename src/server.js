// run me with:
// node server.js

var BN = require('../lib/bn.js');
var http = require('http');

/*** redefine here until I package them ***/
function BlindSign(privkey, blinded) {
  var red = BN.red(privkey.n);
  var b = new BN(blinded).toRed(red);

  //  b**d % n
  var blindSig = b.redPow(privkey.d);

  return blindSig.toArray();
}

var key = '{"n":"27078503134310472095273564050868549370581210988165151186608239950433775341142853609302452603721286363944735339635906695148859929873143935208859650676559330496710101232735428083632610330803386413237198099432106075875388228342037835701362201481300215338986973493899312908401246049328213182416267543699926247361054855676369509272957284461526963587506486311277477061336140145732497974335439343981017853334084143823773064880492250707623430281625996977408518602939820549786730404917731758128039211938903112203780487181131502811467264358951815828061113408643328733100797979373633510022278953590131112945888334643839522717831","e":"65537","d":"10519120669185502984170310926210574155448480256156012390861027830051627117661106093340115367473949517671987076182775356696138440188601422806694811275684330914075140260985569427669905952544721526688829614011047020548873291504950505197384382677150650507579983187835613582174761175669423065003520994172092441392750693079903460236932266493342375279149391905460456823540463457482312248909923314487054419085215162422384203750531959466117589251701047201443672296459092895460130376379220051501774673408481109350420318058119633513479152641715868262334491673715385879705133583584437896655840032622540660042987140342599933378121"}'

function GetKey() {
  return KeyFromString(key);
}
//
// takes bytes, sets as BN's
function Key(n, e, d) {
  // byte arrays
  this.n = new BN(n);
  this.e = new BN(e);
  this.d = new BN(d);
}

function KeyFromString(str) {
  var n = e = d = null;
  var parsed = JSON.parse(str);
  if ('n' in parsed) {
    var n = parsed['n'];
  }
  if ('e' in parsed) {
    var e = parsed['e'];
  }
  if ('d' in parsed) {
    var d = parsed['d'];
  }
  return new Key(n, e, d);
}

Key.prototype = {
  toString:  function () {
    var n = this.n.toString();
    var e = this.e.toString();
    var d = this.d.toString();
    return JSON.stringify({'n': n, 'e': e, 'd': d});
  }
}
/*** start server stuff ***/

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
  var tokens = parsed['tokens'];
  var sigs = [];
  for (i = 0; i < tokens.length; i++) {
    blinded = tokens[i];
    number = new BN.BN(blinded);
    signedarr = BlindSign(GetKey(), number.toArray());
    sig = new BN.BN(signedarr).toString();
    sigs.push([blinded, new BN.BN(signedarr).toString()]);
  }
  return sigs;
}
