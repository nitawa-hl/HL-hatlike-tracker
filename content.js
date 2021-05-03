chrome.runtime.sendMessage({action: 'showPageAction'});

chrome.runtime.onMessage.addListener(gotMessage);

var main = document.createElement('script');
main.src = chrome.runtime.getURL('hat-main.js ');
(document.head || document.documentElement).appendChild(main);

function run_script(name) {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL(name);
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
}

function gotMessage(message, sender, sendResponse) {
    if (message.txt == 'run script') {
        run_script('run-once.js');
    }
}

run_script('setup.js');

window.addEventListener("message", (event) => {
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    chrome.storage.local.set({'HLPstatus': event.data.data});
    if (event.data.notify) {
      var audio = new Audio(chrome.runtime.getURL("alert.mp3"));
      audio.play();
    }
    if (event.data.Qstate) {
        chrome.runtime.sendMessage({
            action: 'updateIcon',
            value: false
        });
    } else {
        chrome.runtime.sendMessage({
            action: 'updateIcon',
            value: true
        });
    }
  }
}, false);
