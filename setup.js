function setup() {
  console.log(window.globals2.conn.ws.readyState);
  if (window.globals2 && window.globals2.conn && window.globals2.conn.ws.readyState == WebSocket.OPEN) {
    window.globals2.conn.ws.onmessage = (function() {
      var old_function = window.globals2.conn.ws.onmessage;
      return function(event) {
        console.log(event);
        old_function(event);
        hat_main();
      }
    })();
  } else {
    window.setTimeout(setup, 100);
  }
}
setup();
