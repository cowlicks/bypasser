function hasCaptchaBypass() {
  var metas = document.getElementsByTagName('meta');
  for (var i=0; i < metas.length; i++) {
    if (metas[i].id == "captcha-bypass") {
      return true;
    }
  } 
  return false;
}

chrome.runtime.sendMessage({
  action: "hasCaptchaBypass",
  source: hasCaptchaBypass() 
});
