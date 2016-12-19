function RandArray() {
  var bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes);
}

// For decoding RSA numbers.
function base64UrlDecode(str) {
  str = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  var buffer = new Uint8Array(str.length);
  for(var i = 0; i < str.length; ++i) {
    buffer[i] = str.charCodeAt(i);
  }
  return buffer;
}

// Generate an RSA key for testing.
function GenKey(callback) {
  window.crypto.subtle.generateKey({
    name: "RSASSA-PKCS1-v1_5",
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: {
      name: "SHA-256"
    },
  }, true, ["sign", "verify"]).then(function(keyPair) {
    window.crypto.subtle.exportKey("jwk", keyPair.privateKey).then(
      function(key) {
        n = base64UrlDecode(key.n);
        e = base64UrlDecode(key.e);
        d = base64UrlDecode(key.d);
        var k = new Key(n, e, d);
        callback(k);
      });
  });
}

// takes bytes, sets as BN's
function Key(n, e, d) {
  // byte arrays
  this.n = new BN(n);
  this.e = new BN(e);
  this.d = new BN(d);
}

// Token constructer.
// Does blinding at construction time.
function Token(pubkey) {
  // byte arrays
  this.bytes = RandArray();
  this.blinder = RandArray();
  this.setHash(this);

  this.blinded = Blind(pubkey, this.hash, this.blinder);
}

Token.prototype.setHash = function (token) {
  doHash(token.bytes, function (hashed){
      token.hash = hashed;
  })
}

function doHash(bytes, callback) {
  window.crypto.subtle.digest(
      { name: "SHA-256", },
      Uint8Array.from(bytes)
  )
  .then(function(hashed) {
      callback(Array.from(hashed));
  });
}

// Create the blinded message
function Blind(pubkey, hashed, blinder) {
  var red = BN.red(pubkey.n);

  var t = new BN(hashed).toRed(red);
  var b = new BN(blinder).toRed(red);

  // m r**e % n
  var blinded = t.redMul(b.redPow(pubkey.e));

  return blinded.toArray();
}

// Server signs blinded message
function BlindSign(privkey, blinded) {
  var red = BN.red(privkey.n);

  var b = new BN(blinded).toRed(red);

  //  b**d % n
  var blindSig = b.redPow(privkey.d);
  return blindSig.toArray();
}

// Client unblinds signature
function Unblind(pubkey, token, blindSig) {
  var red = BN.red(pubkey.n);

  var bs = new BN(blindSig).toRed(red);

  var r = new BN(token.blinder).toRed(red);
  var rinv = r.redInvm();

  // bs rinv % n
  var sig = (bs.redMul(rinv));
  return sig.toArray();
}

function VerifySig(pubkey, token, sig, callback) {
  doHash(token.bytes, function (hashed) {
    var red = BN.red(pubkey.n);

    var t = new BN(hashed).toRed(red);
    var s = new BN(sig).toRed(red);

    // hashed == sig**e % n
    var res = s.redPow(pubkey.e).eq(t);
    callback(res);
  });
}
