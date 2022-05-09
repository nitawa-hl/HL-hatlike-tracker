chrome.runtime.sendMessage({action: 'showPageAction'});

chrome.runtime.onMessage.addListener(gotMessage);

var main = document.createElement('script');
main.src = chrome.runtime.getURL('hat-main.js');
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

// enter space home end, arrow keys, [ ]
const keycodes = [13, 32, 35, 36, 37, 38, 39, 40, 32, 219, 221];
document.onkeydown = function(e) {
  // small time delay of 20ms to avoid race condition
  if (keycodes.includes(e.keyCode)) {
    window.setTimeout(function() {
      run_script('run-once.js');
    }, 20);
  }
}
document.onclick = function(e) {
  run_script('run-once.js');
}

window.addEventListener("message", (event) => {
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    chrome.storage.local.set({'HLPstatus': event.data.data});
    if (event.data.notify) {
      window.setTimeout(function() {
        var audio = new Audio(chrome.runtime.getURL("alert.mp3"));
        audio.volume = 0.20;
        var promise = audio.play();
        if (promise !== undefined) {
          promise.catch(function (error) {
            alert("A hatlike play occured! We tried to play an air horn, but couldn't.");
          });
        }
      }, 100);
    }
    if (event.data.update) {
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
  }
}, false);
