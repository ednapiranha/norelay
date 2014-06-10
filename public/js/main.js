'use strict';

var form = document.getElementById('form');
var input = document.getElementById('input');

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

  var message = input.value.trim();
  input.value = '';

  xmlhttp.open('POST', '/', true);
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xmlhttp.send('input=' + encodeURIComponent(message));
};

form.onkeyup = function (ev) {
  switch (ev.keyCode) {
    case 13:
      ev.preventDefault();
      // enter
      if (input.value.slice(0, 1) !== '/') {
        render.channel(render.currChannel);
        render.message({
          message: input.value,
          channel: render.currChannel
        }, true);
      }

      submitForm();
      break;
    case 38:
      ev.preventDefault();
      // up arrow
      input.value = '';
      input.value = render.messageArr[render.currHistoryPosition];
      console.log('up: ', input.value, render.currHistoryPosition)
      render.currHistoryPosition ++;

      if (render.currHistoryPosition > render.messageArr.length - 1) {
        render.currHistoryPosition = render.messageArr.length - 1;
      }
      break;
    case 40:
      ev.preventDefault();
      // down arrow
      input.value = '';
      input.value = render.messageArr[render.currHistoryPosition];
      console.log('down: ', input.value, render.currHistoryPosition)
      render.currHistoryPosition --;

      if (render.currHistoryPosition < 0) {
        render.currHistoryPosition = 0;
      }
      break;
    default:
      break;
  }
};
