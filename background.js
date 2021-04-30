chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === "updateIcon") {
        if (msg.value) {
            chrome.pageAction.setIcon({path: "green-hat.png", tabId: sender.tab.id});
        } else {
            chrome.pageAction.setIcon({path: "red-hat.png", tabId: sender.tab.id});
        }
    }
    if (msg.action === 'showPageAction') {
        chrome.pageAction.show(sender.tab.id);
    }
});
