function setupSocketWatch() {
  if (window.globals2 && window.globals2.conn && window.globals2.conn.ws.readyState == WebSocket.OPEN) {
    window.globals2.conn.ws.onmessage = (function() {
      var old_function = window.globals2.conn.ws.onmessage;
      return function(event) {
        old_function(event);
        if (event.data.startsWith('clock')) {
          // Give the blind-play sound a bit of time before air horn
          window.setTimeout(function() {
            hat_main(event.data.startsWith('clock'));
          }, 350);
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
