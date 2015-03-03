chrome.tabs.onUpdated.addListener(function () {
    chrome.tabs.executeScript(null, {file: 'js/content.js'});
});

chrome.tabs.onSelectionChanged.addListener(function () {
    chrome.tabs.executeScript(null, {file: 'js/content.js'});
});

chrome.runtime.onMessage.addListener(function (message) {
    if (message.type == 'content') {
        var pathname = message.pathname.substr(1);
        if (message.host == 'vk.com') {
            setActivationIcon(true);
            resolveScreenName(pathname);
        } else {
            setActivationIcon(false);
        }
    }
});

function resolveScreenName(screen_name) {
    var response = new XMLHttpRequest();
    response.open("GET", "http://api.vk.com/method/utils.resolveScreenName?screen_name=" + screen_name, true);
    response.onreadystatechange = function () {
        if (response.readyState == 4) {
            var json = JSON.parse(response.responseText);
            if (json.response.type == 'group' || json.response.type == "page") {
                getWall(json.response.object_id);
            } else {
                setCountPostToIcon('');
            }
        }
    }
    response.send();
}

function getWall(owner_id) {
    var response = new XMLHttpRequest();
    response.open("GET", "http://api.vk.com/method/wall.get?owner_id=-" + owner_id + "&count=51", true);
    response.onreadystatechange = function () {
        if (response.readyState == 4) {

            var json = JSON.parse(response.responseText);
            var now = new Date();
            var zoneMSK = (180 + now.getTimezoneOffset()) * 60 * 1000;
            var startDate = new Date((now.getTime() + zoneMSK) - (86400000));

            startDate.setHours(23);
            startDate.setMinutes(59);
            startDate.setSeconds(59);

            var countTrue = 0;
            for (i = 1; i < json.response.length; i++) {
                if (new Date(json.response[i].date * 1000 + zoneMSK) > startDate)
                    countTrue++;
            }
            setCountPostToIcon((50 - countTrue))
        }
    }
    response.send();
}

function setActivationIcon(host) {
    if (host) {
        chrome.browserAction.setIcon({path: "images/icon48.png"});
    } else {
        chrome.browserAction.setIcon({path: "images/icon48_BW.png"});
        setCountPostToIcon('');
    }
}

function setCountPostToIcon(text) {
    var count = text + '';
    chrome.browserAction.setBadgeText({text: count});
    chrome.browserAction.setBadgeBackgroundColor({color: [111, 111, 111, 255]});
};