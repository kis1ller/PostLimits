window.addEventListener('load', function () {
    chrome.runtime.onMessage.addListener(function (message) {
            document.getElementById("title").innerHTML= "(" + message.count + "/" + (50 - message.count ) + ")";
    });
})