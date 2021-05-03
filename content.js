chrome.runtime.sendMessage({action: 'showPageAction'});

chrome.runtime.onMessage.addListener(gotMessage);

var seconds = 1
window.setInterval(run_script , seconds*1000);

function gotMessage(message, sender, sendResponse) {
    if (message.txt == 'run script') {
        run_script();
    }
}

function run_script() {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('script.js');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
}

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
