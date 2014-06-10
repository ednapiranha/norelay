(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Render = function () {
  this.HISTORY_MAX = 100;
  this.messages = document.getElementById('messages-inner');
  this.channelContent = document.getElementById('channel-inner');
  this.usersContent = document.getElementById('users-inner');
  this.currHistoryPosition = 0;
  this.channels = {};
  this.messageArr = [];
  this.currChannel;

  this.channel = function (channel) {
    if (!this.channels[channel]) {
      this.channels[channel] = {
        users: [],
        messages: []
      };

      this.channelContent.innerHTML += '<li>' + channel + '</li>';
    }
  };

  this.users = function () {
    var users = '';

    for (var k in this.channels[this.currChannel].users) {
      users += '<li>' + k + '</li>';
    }

    this.usersContent.innerHTML = users;
  };

  this.message = function (message) {
    this.channels[message.channel].messages.push('<p>' + message.message + '</p>');
    this.messageArr.unshift(message.message);
    this.messages.innerHTML = this.channels[message.channel].messages.join('');
  };
};

module.exports = Render;

},{}],2:[function(require,module,exports){
'use strict';

var Socket = function (render) {
  var socket = io();

  socket.on('channel', function (channel) {
    render.currChannel = channel;
    render.channel(render.currChannel);
  });

  socket.on('users', function (users) {
    render.channel(render.currChannel);
    render.channels[render.currChannel].users = users.users;
    render.users();
  });

  socket.on('message', function (message) {
    render.channel(message.channel);

    render.message(message);
  });
}

module.exports = Socket;

},{}],3:[function(require,module,exports){
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
      input.value = render.messageArr[render.currHistoryPosition];
      console.log('up: ', input.value, render.currHistoryPosition)
      render.currHistoryPosition ++;

      if (render.currHistoryPosition > render.messageArr.length - 1) {
        render.currHistoryPosition = render.messageArr.length - 1;
      }
      break;
    case 40:
      // down arrow
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

},{"./lib/render":1,"./lib/socket":2}]},{},[3])