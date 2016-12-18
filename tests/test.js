(function() {
  module('background');

  test('integration', function() {
    var a = new BN('dead', 16);
  });
  test('howdoes fromstring work', function() {
    var b1 = new Uint8Array(4);
    window.crypto.getRandomValues(b1);
  });
})();

