chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "hasCaptchaBypass") {
    if (request.source == true) {
      console.log("gotcha");
    }
  }
});
