var express = require('express');
var app = express();
var server = require('http').Server(app);
var nconf = require('nconf');
var io = require('socket.io')(server);
var env = process.env.NODE_ENV || 'development';
var bodyParser = require('body-parser');

io.on('connection', function (socket) {
  console.log('connected');
});

nconf.argv().env().file({ file: 'local.json' });

// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.locals.pretty = true;

// routes
require('./routes')(app, io, nconf);

server.listen(process.env.PORT || nconf.get('port'));
