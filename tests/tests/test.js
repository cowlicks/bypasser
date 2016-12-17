var serverKey = new RSAKey();
(function() {
  module('background');

  test('integration', function() {
    serverKey.generate('1024', '3');
    equal(serverKey.e, 3, 'test passed');

    var clientKey = new RSAKey();
    clientKey.setPublic(serverKey.n.toRadix(16), serverKey.e.toString(16));
    equal(serverKey.n.toString(), clientKey.n.toString(), 'test passed');

    var token = new Token(clientKey);
    var blindSig = BlindSign(serverKey, token.blinded);

    var sig = Unblind(clientKey, token, blindSig);
    equal(CheckSig(clientKey, token, sig), true);
  });
})();
