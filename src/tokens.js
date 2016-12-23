/* Stuff for Tokens. When `new Token()` is used it gets random bytes and and
 * blinder data. Then when `init()` is called, the `blinded` attribute is
 * added.
 */

// Token constructer.
function Token() {
  // byte arrays
  this.bytes = randArray();
  this.blinder = randArray();
}

Token.init = function(pubkey) {
  if (typeof pubkey == 'undefined') {
    pubkey = getKey();
  }

  var token = new Token();
  return doHash(token.bytes)
  .then(function(hashed) {
    token.hash = hashed;
  })
  .then(() => {
    token.blinded = blind(pubkey, token.hash, token.blinder);
    return token
  })
}

function makeTokens(ntokens) {
  promises = [];
  for (i = 0; i < ntokens; i++) {
    promises.push(Token.init());
  }
  return Promise.all(promises);
}
