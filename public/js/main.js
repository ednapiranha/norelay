var form = document.getElementById('form');
var input = document.getElementById('input');
var messages = document.getElementById('messages-inner');
var currHistoryPosition = 0;
var socket = io();
var messageArr = [];
var xmlhttp = new XMLHttpRequest();

var HISTORY_MAX = 100;

var renderMessage = function (message) {
  messageArr.push('<p>' + message + '</p>');
  messages.innerHTML = messageArr.join('');
};

var submitForm = function () {
  if (messageArr.length > HISTORY_MAX) {
    messageArr.pop();
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
        renderMessage(input.value);
      }
      submitForm();
      break;
    case 38:
      // up arrow
      input.value = messageArr[currHistoryPosition];
      currHistoryPosition ++;

      if (currHistoryPosition > messageArr.length - 1) {
        currHistoryPosition = messageArr.length - 1;
      }

      break;
    case 40:
      // down arrow
      input.value = messageArr[currHistoryPosition];
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

socket.on('message', function (message) {
  renderMessage(message.message);
});
