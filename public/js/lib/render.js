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
