'use strict';

module.exports = function (app, io, nconf) {
  var irc = require('irc');
  var moment = require('moment');
  var client;
  var server;
  var channels = {};
  var activeChannel;
  var nick = 'Guest' + Math.floor(Math.random() * (3000 - 1000) + 1000);

  app.get('/', function (req, res) {
    res.render('index');
  });

  app.post('/', function (req, res) {
    var input = req.body.input.trim().split(' ');

    switch (input[0].toString().toLowerCase()) {
      case '/server':
        server = input[1].trim();
        client = new irc.Client(server, nick);

        client.addListener('registered', function (message) {
          console.log('registered ', message);
        });

        client.addListener('message', function (from, to, message) {
          console.log(from, to, message);
          io.sockets.emit('message', {
            channel: activeChannel,
            message: from + ': ' + message
          });
        });

        client.addListener('names', function (channel, users) {
          io.sockets.emit('users', {
            channel: channel,
            users: users
          });
        });

        client.addListener('error', function (message) {
          console.error('error: ', message);
        });

        //client.say('NickServ', 'IDENTIFY ' + nconf.get('password'));
        break;

      case '/j':
      case '/join':
        activeChannel = input[1].trim();

        client.join(activeChannel, function () {
          channels[activeChannel] = true;

          client.send('names', activeChannel);

          io.sockets.emit('channel', activeChannel);
        });
        break;

      case '/nick':
        nick = input[1].trim();
        client.send('nick', nick);
        break;

      default:
        if (!server) {
          return;
        }
        console.log('defaulting to ', input.join(' '));
        client.say(activeChannel, input.join(' '));
        break;
    };
  });
};
