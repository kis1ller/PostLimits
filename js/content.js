chrome.runtime.sendMessage({
    'type': 'content',
    'host': window.location.host,
    'pathname': window.location.pathname
});