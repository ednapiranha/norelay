
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
