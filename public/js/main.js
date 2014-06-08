$(function () {
  var form = $('form');
  var input = $('textarea');
  var messages = $('#messages');
  var history = [];
  var currHistoryPosition = 0;
  var socket = io();

  var HISTORY_MAX = 10;

  var submitForm = function () {
    var formContent = form.serialize();

    if (history.length > HISTORY_MAX) {
      history.pop();
    }

    history.unshift(input.val());
    input.val('');
    $.post('/', formContent, function (data) {

    });
  };

  form.on('keyup', function (ev) {
    switch (ev.keyCode) {
      case 13:
        // enter
        submitForm();
        break;
      case 38:
        // up arrow
        input.val(history[currHistoryPosition]);
        currHistoryPosition ++;

        if (currHistoryPosition > history.length - 1) {
          currHistoryPosition = history.length - 1;
        }

        break;
      case 40:
        // down arrow
        input.val(history[currHistoryPosition]);
        console.log(input.val())
        currHistoryPosition --;

        if (currHistoryPosition < 0) {
          currHistoryPosition = 0;
        }

        break;
      default:
        break;
    }
  });

  socket.on('message', function (message) {
    messages.append($('<p>').text(message.message));
  });
});
