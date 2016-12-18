var ZERO = BigInteger.ZERO;
var ONE = BigInteger.ONE;


function FromBytes(x) {
  var a = 2**x.length;
  var t = a&7;
  if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
  var b = nbi();
  b.fromString(x,256);
  return b;
}



function AsInt(bytes) {
  return new BigInteger(bytes);
}

function Token(pubkey) {
  var bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  this.bytes = bytes;

  var blinder = new Uint8Array(32);
  window.crypto.getRandomValues(blinder);
  this.blinder = blinder;

  this.blinded = Blind(pubkey, bytes, blinder);
}

Token.prototype = {};


function Blind(pubkey, token, blinder) {
  // blind a token and return it with the blinding factor
  var t = new BigInteger(token);
  var b = new BigInteger(blinder);
  var blinded = t.multiply(pubkey.doPublic(b)).mod(pubkey.n);
  return blinded.toByteArray()
}

function BlindSign(privkey, blinded) {
  var b = new BigInteger(blinded)
  return privkey.doPrivate(b).toByteArray();
}

function Unblind(pk, token, blindSig) {
  var b = AsInt(token.blinder);
  var blindinv = EucInvMod(AsInt(token.blinder), pk.n);

  return (AsInt(blindSig).multiply(blindinv)).mod(pk.n).toByteArray();
}

function CheckSig(pk, token, sig) {
  var res = AsInt(token.bytes).compareTo(pk.doPublic(AsInt(sig)));

  return res === 0;
}


function EucInvMod(g, n) {
  var z = nbi();
  EuclideanGCD(z, null, g, n);
  if (z.compareTo(BigInteger.ZERO) < 0) {
    z.addTo(n, z);
  }
  return z
}

function EuclideanGCD(x, y, a, b) {
  var z = nbi();
  if ((a.compareTo(ZERO) <= 0) || (b.compareTo(ZERO) <= 0)) {
    z = nbv(0);
    if (x === null) {
      x = nbv(0);
    }
    if (y === null) {
      y = nbv(0);
    }
    return z
  }

  if (x === null && y === null) {
    return a.gcd(b);
  }

  var A = nbi();
  var B = nbi();
  a.copyTo(A);
  b.copyTo(B);

  var X = nbv(0);
  var lastY = nbv(0);
  var q = nbv(0);
  var temp = nbv(0);
  var r = nbv(0);

  var Y = nbv(1);
  var lastX = nbv(1);

  while (B.compareTo(ZERO) != 0) {
    A.divRemTo(B, q, r);
    B.copyTo(A);
    r.copyTo(B);
    A.copyTo(r);

    X.copyTo(temp);
    X = X.multiply(q);
    X = X.negate();
    X = X.add(lastX);
    temp.copyTo(lastX);

    Y.copyTo(temp);
    Y = Y.multiply(q);
    Y = Y.negate();
    Y = Y.add(lastY);
    temp.copyTo(lastY);
  }

  if (x !== null) {
    lastX.copyTo(x);
  }

  if (y !== null) {
    lastY.copyTo(y);
  }

  A.copyTo(z);
  return z
}
