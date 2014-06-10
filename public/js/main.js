var form = document.getElementById('form');
var input = document.getElementById('input');

var currHistoryPosition = 0;

var xmlhttp = new XMLHttpRequest();
var Render = require('./lib/render');
var render = new Render();
var Socket = require('./lib/socket');
var socket = new Socket(render);

var submitForm = function () {
  if (render.channels[render.currChannel] &&
      render.channels[render.currChannel].messages.length > render.HISTORY_MAX) {
    render.channels[render.currChannel].messages.pop();
    render.messagesArr.pop();
  }

  var message = input.value;
  input.value = '';

  xmlhttp.open('POST', '/', true);
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xmlhttp.send('input=' + encodeURIComponent(message));
};

form.onkeyup = function (ev) {
  switch (ev.keyCode) {
    case 13:
      // enter
      if (input.value.slice(0, 1) !== '/') {
        render.channel(render.currChannel);

        render.message({
          message: input.value,
          channel: render.currChannel
        });
      }

      submitForm();
      break;
    case 38:
      // up arrow
      input.value = render.messageArr[currHistoryPosition];
      currHistoryPosition ++;

      if (currHistoryPosition > render.messageArr.length - 1) {
        currHistoryPosition = render.messageArr.length - 1;
      }
      break;
    case 40:
      // down arrow
      input.value = render.messageArr[currHistoryPosition];
      console.log(input.value)
      currHistoryPosition --;

      if (currHistoryPosition < 0) {
        currHistoryPosition = 0;
      }
      break;
    default:
      break;
  }
};
