var form = document.getElementById('form');
var input = document.getElementById('input');
var messages = document.getElementById('messages-inner');
var channelContent = document.getElementById('channel-inner');
var usersContent = document.getElementById('users-inner');
var currHistoryPosition = 0;
var socket = io();
var channels = {};
var messageArr = [];
var currChannel;
var xmlhttp = new XMLHttpRequest();

var HISTORY_MAX = 100;

var setChannel = function (channel) {
  if (!channels[channel]) {
    channels[channel] = {
      users: [],
      messages: []
    };

    channelContent.innerHTML += '<li>' + channel + '</li>';
  }
};

var renderUsers = function () {
  var users = '';

  for (var k in channels[currChannel].users) {
    users += '<li>' + k + '</li>';
  }

  usersContent.innerHTML = users;
};

var renderMessage = function (message) {
  channels[message.channel].messages.push('<p>' + message.message + '</p>');
  messageArr.push(message.message);
  messages.innerHTML = channels[message.channel].messages.join('');
};

var submitForm = function () {
  if (channels[currChannel] && channels[currChannel].messages.length > HISTORY_MAX) {
    channels[currChannel].messages.pop();
    messagesArr.pop();
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
        setChannel(currChannel);

        renderMessage({
          message: input.value,
          channel: currChannel
        });
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

socket.on('channel', function (channel) {
  currChannel = channel;
  setChannel(currChannel);
});

socket.on('users', function (users) {
  setChannel(currChannel);
  channels[currChannel].users = users.users;
  renderUsers();
});

socket.on('message', function (message) {
  setChannel(message.channel);

  renderMessage(message);
});
