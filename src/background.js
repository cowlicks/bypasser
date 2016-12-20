var p = console.log;
var unsigned = [];
var pending = new Set();
var signed = [];

function fill() {
  var nMoreTokens = 100 - unsigned.length
  if (nMoreTokens > 0) {
    MakeTokens(nMoreTokens).then(tokens => {
      Array.prototype.push.apply(unsigned, tokens);
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

function receiveSigs(error, tokenArr) {
  console.log(tokenArr);
}

function submitToken(origin) {
  // get tokens
  p('sthnhnh');
  var data = [];
  var tokens = getTokensToSend();
  while (tokens.length) {
    var t = tokens.pop();
    var h = new BN(tokens.pop().hash);
    var tstring = h.toString();
    pending.add(tstring);
    data.push(tstring);
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
  xhr.send(JSON.stringify({tokens: data}));
}

function init() {
  fill();
  p('filled');
  chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "hasCaptchaBypass") {
      if (request.source == true) {
        submit(sender.url);
      }
    }
  });
}
console.log('go!');
init();
