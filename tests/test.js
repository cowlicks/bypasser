QUnit.test('randarr', function(assert) {
    assert.equal(RandArray().length, 32);
});

QUnit.test('fromarr', function(assert) {
    var arr = new Uint8Array([0x01, 0x00, 0x01]);
    var bn = new BN(arr);
    assert.ok(bn == 65537);
    assert.ok(bn.toNumber() === 65537);
});

QUnit.test('genkey', function(assert) {
  var done = assert.async();
  GenKey(function (key) {
    assert.equal(key.e.toNumber(), 65537);
    assert.deepEqual(key.e.toArray(), [0x01, 0x00, 0x01]);
    done();
  });
});

QUnit.test('integration-test', function(assert) {
  var done = assert.async();
  GenKey(function (key) {
    // client creates a token
    var token = new Token(key);

    // client sends blinded token to server
    // server returns the blinded signature
    var blindSig = BlindSign(key, token.blinded);

    // client unblinds the signature
    var sig = Unblind(key, token, blindSig);

    // We verify the signature
    VerifySig(key, token, sig, function (res) {
      assert.ok(res);
      done();
    })
  })
});
