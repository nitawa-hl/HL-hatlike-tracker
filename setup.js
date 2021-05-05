function setupSocketWatch() {
  if (window.globals2 && window.globals2.conn && window.globals2.conn.ws.readyState == WebSocket.OPEN) {
    window.globals2.conn.ws.onmessage = (function() {
      var old_function = window.globals2.conn.ws.onmessage;
      return function(event) {
        old_function.apply(this, arguments);
        if (event.data.startsWith('clock')) {
          // going to delay a few ms because I am worried about
          // possible race condition against computing new state
          window.setTimeout(function() {
            hat_main(true);
          }, 20);
        } else {
          hat_main();
        }
      }
    })();
    // After websocket connected, initialize
    window.setTimeout(hat_main, 50);
  } else {
    window.setTimeout(setupSocketWatch, 100);
  }
}

function setupStateWatch() {
  if (window.globals && window.globals.store) {
    window.globals.store.subscribe(function() {
      hat_main();
    });
  } else {
    window.setTimeout(setupStateWatch, 100);
  }
}

setupSocketWatch();
setupStateWatch();
