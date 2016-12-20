/*** benchmarks ***/
// ~3 ms per Token constructor call which includes blinding.
function benchTokens() {
  GenKey(function (key) {
    var t0 = performance.now();

    var unsigned = [];

    console.log(unsigned.length);
    function fill(key) {
      while (unsigned.length < 1000) {
        unsigned.push(new Token(key));
      }
    };
    fill(key);

    var t1 = performance.now();
    console.log("Generating tokens took" + (t1 - t0) + " milliseconds.")
  });
}
