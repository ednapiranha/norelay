'use strict';

module.exports = function (app, io, nconf) {
  var irc = require('irc');
  var moment = require('moment');
  var clients = {};
  var server;
  var channel;
  var nick = 'Guest' + Math.floor(Math.random() * (3000 - 1000) + 1000);

  app.get('/', function (req, res) {
    res.render('index');
  });

  app.post('/', function (req, res) {
    var input = req.body.input.trim().split(' ');

    switch (input[0]) {
      case '/server':
        server = input[1].trim();
        console.log('1 ' , server);
        clients[server] = new irc.Client(server, nick);

        clients[server].addListener('registered', function (message) {
          console.log('registered ', message);
        });

        clients[server].addListener('message', function (from, to, message) {
          console.log(from, to, message);
          io.on('connection', function (socket) {
            socket.emit('message', { message: message });
          });
        });

        clients[server].addListener('error', function (message) {
          console.error('error: ', message);
        });

        break;
      case '/j':
      case '/join':
        channel = input[1].trim();
        console.log('curr channel ', channel)
        clients[server].join(channel, function () {
          console.log('connected to ', channel);
          //client.say('NickServ', 'IDENTIFY ' + nconf.get('password'));
        });
        break;
      case '/nick':
        nick = input[1].trim();
        clients[server].say(channel, '/nick ' + nick);
      default:
        console.log('defaulting to ', input.join(' '));
        break;
    };
  });
};
