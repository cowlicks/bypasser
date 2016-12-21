QUnit.test('raw-rsa', function(assert) {
  var key = GetKey();
  var arr = RandArray();

  var red = BN.red(key.n);

  var sigarr = BlindSign(key, arr);
  var sig = new BN(sigarr).toRed(red);
  var orig = new BN(arr).toRed(red);

  var res = sig.redPow(key.e);
  assert.ok(res.eq(orig));
})

QUnit.test('bn invmod', function(assert) {
  var key = GetKey();
  var arr = RandArray();

  var red = BN.red(key.n);
  var orig = new BN(arr).toRed(red);
  var originv = orig.redInvm();

  var maybeone = orig.redMul(originv);
  assert.ok(maybeone == 1);
})

QUnit.test('integration-test', function(assert) {
  var done = assert.async();
  GenKey(function (key) {
    // client creates a token
    Token.init(key).then(token => {
      // client sends blinded token to server
      // server returns the blinded signature
      var blindSig = BlindSign(key, token.blinded);

      // client unblinds the signature
      var sig = Unblind(key, token, blindSig);

      // We verify the signature
      VerifySig(key, token, sig, function (res) {
        assert.ok(res);
        done();
      });
    });
  });
});

QUnit.test('randarr', function(assert) {
  assert.equal(RandArray().length, 32);
});

QUnit.test('BN works like I think it does', function(assert) {
    var arr = new Uint8Array([0x01, 0x00, 0x01]);
    var bn = new BN(arr);
    assert.ok(bn == 65537);
    assert.ok(bn.toNumber() === 65537);
});

QUnit.test('GenKey does the right thing', function(assert) {
  var done = assert.async();
  GenKey(function (key) {
    assert.equal(key.e.toNumber(), 65537);
    assert.deepEqual(key.e.toArray(), [0x01, 0x00, 0x01]);
    done();
  });
});

QUnit.test('math-test', function(assert) {
  var done = assert.async();
  var key = GetKey();
  Token.init(key).then(token => {
    var red = BN.red(key.n);

    var hash = new BN(token.hash).toRed(red);
    var hashinv = hash.redInvm();
    assert.ok(hash.redMul(hashinv).eq(new BN(1)));

    var blinder = new BN(token.blinder).toRed(red);
    var blinderinv = blinder.redInvm();

    // m r**e % n
    var blinded = hash.redMul(blinder.redPow(key.e));
    assert.ok(blinded.redMul(hashinv).eq(blinder.redPow(key.e)));
    assert.ok(blinded.redMul(hashinv).redMul(hash).eq(blinded));

    //  b**d % n
    var blindSig = blinded.redPow(key.d);
    assert.ok(blinded.eq(blinded.redPow(key.d).redPow(key.e)));

    var sig = blindSig.redMul(blinderinv);
    assert.ok(sig.eq(hash.redPow(key.d)));

    var res = sig.redPow(key.e);
    assert.ok(res.eq(hash));
    done();
  });
});
