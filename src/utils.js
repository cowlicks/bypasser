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

function doHash(bytes, callback) {
  return window.crypto.subtle.digest(
    { name: "SHA-256", },
    Uint8Array.from(bytes)
  )
  .then(hashed => {
    return new Uint8Array(hashed);
  });
}

function otherHash(bytes, callback) {
  return new Promise(resolve => {
    window.crypto.subtle.digest({ name: "SHA-256", }, Uint8Array.from(bytes))
    .then(hashed => {
      resolve(new Uint8Array(hashed));
    })
  });
}
