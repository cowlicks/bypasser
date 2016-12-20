// Token constructer.
function Token() {
  // byte arrays
  this.bytes = RandArray();
  this.blinder = RandArray();
}

Token.init = function(pubkey) {
  if (typeof pubkey == 'undefined') {
    pubkey = GetKey();
  }

  var token = new Token();
  return doHash(token.bytes)
  .then(function(hashed) {
    token.hash = hashed;
  })
  .then(() => {
    token.blinded = Blind(pubkey, token.hash, token.blinder);
    return token
  })
}

function MakeTokens(ntokens) {
  promises = [];
  for (i = 0; i < ntokens; i++) {
    promises.push(Token.init());
  }
  return Promise.all(promises);
}

