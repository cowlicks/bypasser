var unsigned = [];
var pending = {};
var signed = [];

function fill() {
  var nMoreTokens = 100 - unsigned.length
  if (nMoreTokens > 0) {
    MakeTokens(nMoreTokens).then(tokens => {
      Array.prototype.push.apply(unsigned, tokens);
      console.log(unsigned.length + " unsigned tokens ready");
    });
  }
}

function getTokensToSend() {
  var nWanted = 50;
  var toSend = [];
  while (toSend.length < nWanted) {
    while ((toSend.length < nWanted) && (unsigned.length)) {
      var t = unsigned.pop();
      if (typeof t != 'undefined') {
        toSend.push(t);
      }
    }
    fill()
  }
  return toSend
}

function receiveSigs(error, data) {
  var sigs = data['sigs'];
  console.log(sigs.length + " tokens received");
  for (var i = 0; i < sigs.length; i++) {
    var blinded = sigs[i][0];
    var blindSig = sigs[i][1];
    if (blinded in pending) {
      var token = pending[blinded];
      var sig = Unblind(GetKey(), token, blindSig);
      delete pending[blinded];
      VerifySig(GetKey(), token, sig, function (res) {
        if (res == true) {
          signed.push([token, sig]);
        }
      });
    }
  }
}

function submitTokens(origin) {
  // get tokens
  var data = [];
  var tokens = getTokensToSend();
  while (tokens.length) {
    var t = tokens.pop();
    var b = new BN(t.blinded);
    var bstring = b.toString();
    pending[bstring] = t;
    data.push(bstring);
  }

  var xhr = new XMLHttpRequest();   // new HttpRequest instance 
  xhr.onreadystatechange = function(){
    //on done
    if(xhr.readyState == xhr.DONE){
      //on success
      if(xhr.status == 200) {
        receiveSigs(null, JSON.parse(xhr.responseText));
      } else {
        var error = {status: xhr.status, message: xhr.responseText, object: xhr};
        receiveSigs(error, error.message);
      }
    }
  };

  var target = origin + 'captcha-bypass';
  xhr.open("POST", target, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({'tokens': data}));
  console.log(data.length + " tokens sent");
}

function RedeemToken(origin) {
  if (!signed.length) {
    return submitTokens(origin)
  }
  var tokensig = signed.pop()
  var token = tokensig[0];
  var sig = tokensig[1];

  var data = [token.bytes, sig]

  var xhr = new XMLHttpRequest();   // new HttpRequest instance 
  xhr.onreadystatechange = function(){
    //on done
    if(xhr.readyState == xhr.DONE){
      //on success
      if(xhr.status == 200) {
        bypass(null, xhr.responseText);
      } else {
        var error = {status: xhr.status, message: xhr.responseText, object: xhr};
        bypass(error, error.message);
      }
    }
  };

  var target = origin + 'redeem';
  xhr.open("POST", target, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({'bytes': token.bytes, 'sig': sig}));
  console.log('redeeming token');
}

function bypass(err, data) {
if (err == null) {
    console.log('redemption success');
  } else {
    console.log('redemption failed');
  }
}

function init() {
  fill();
  chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "hasCaptchaBypass") {
      if (request.source == true) {
        RedeemToken(sender.url);
      }
    }
  });
}
console.log('go!');
init();
