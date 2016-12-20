// Create the blinded message
function Blind(pubkey, hashed, blinder) {
  var red = BN.red(pubkey.n);

  var h = new BN(hashed).toRed(red);
  var b = new BN(blinder).toRed(red);

  // m r**e % n
  var blinded = h.redMul(b.redPow(pubkey.e));

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
  var blinder = new BN(token.blinder).toRed(red);
  var b = new BN(token.blinded).toRed(red);

  var blinderinv = blinder.redInvm();

  // bs rinv % n
  var sig = bs.redMul(blinderinv);

  return sig.toArray();
}

function VerifySig(pubkey, token, sig, callback) {
  doHash(token.bytes).then(hashed => {
    var red = BN.red(pubkey.n);

    var t = new BN(hashed).toRed(red);
    var s = new BN(sig).toRed(red);

    // hashed == sig**e % n
    var res = s.redPow(pubkey.e).eq(t);
    callback(res);
  });
}
