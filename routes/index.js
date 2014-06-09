'use strict';

module.exports = function (app, io, nconf) {
  var irc = require('irc');
  var moment = require('moment');
  var client;
  var server;
  var channel;
  var nick = 'Guest' + Math.floor(Math.random() * (3000 - 1000) + 1000);

  app.get('/', function (req, res) {
    res.render('index');
  });

  app.post('/', function (req, res) {
    var input = req.body.input.trim().split(' ');

    switch (input[0].toString().toLowerCase()) {
      case '/server':
        server = input[1].trim();
        console.log('1 ' , server);
        client = new irc.Client(server, nick);

        client.addListener('registered', function (message) {
          console.log('registered ', message);
        });

        client.addListener('message', function (from, to, message) {
          console.log(from, to, message);
          io.sockets.emit('message', {
            channel: channel,
            message: from + ': ' + message
          });
        });

        client.addListener('error', function (message) {
          console.error('error: ', message);
        });
        break;

      case '/j':
      case '/join':
        channel = input[1].trim();

        client.join(channel, function () {
          console.log('connected to ', channel);
          //client.say('NickServ', 'IDENTIFY ' + nconf.get('password'));
          res.json({
            action: 'join',
            channel: channel
          });
        });
        break;

      case '/nick':
        nick = input[1].trim();
        client.send('nick', nick);
        break;

      default:
        console.log('defaulting to ', input.join(' '));
        client.say(channel, input.join(' '));
        break;
    };
  });
};
