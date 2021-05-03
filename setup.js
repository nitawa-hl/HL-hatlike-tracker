function setupSocketWatch() {
  if (window.globals2 && window.globals2.conn && window.globals2.conn.ws.readyState == WebSocket.OPEN) {
    window.globals2.conn.ws.onmessage = (function() {
      var old_function = window.globals2.conn.ws.onmessage;
      return function(event) {
        console.log(event);
        old_function(event);
        hat_main(event.data.startsWith('clock'));
      }
    })();
  } else {
    window.setTimeout(setupSocketWatch, 100);
  }
}

function setupStateWatch() {
  if (window.globals && window.globals.store) {
    window.globals.store.subscribe(function() {
      hat_main();
    });
    hat_main(); // initialize
  } else {
    window.setTimeout(setupStateWatch, 100);
  }
}

setupSocketWatch();
setupStateWatch();
