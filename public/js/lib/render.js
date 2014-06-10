'use strict';

var Render = function () {
  var twitter = require('twitter-text');

  this.HISTORY_MAX = 100;
  this.messages = document.getElementById('messages-inner');
  this.channelContent = document.getElementById('channel-inner');
  this.usersContent = document.getElementById('users-inner');
  this.currHistoryPosition = 0;
  this.nick;
  this.channels = {};
  this.messageArr = [];
  this.currChannel;

  var self = this;

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

  this.message = function (message, isSelf) {
    var pEl = document.createElement('p');
    pEl.innerHTML = twitter.autoLink(twitter.htmlEscape(message.message), { targetBlank: true });

    if (isSelf) {
      pEl.className = 'self';
    }

    this.channels[message.channel].messages.push(pEl);
    this.messageArr.unshift(message.message);

    this.channels[message.channel].messages.forEach(function (m) {
      self.messages.appendChild(m);
    });
  };
};

module.exports = Render;
