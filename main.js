var debug = require('debug')('myapp:server');
var http = require('http');
var app = require('./app')
var port = normalizePort(process.env.PORT || '80');
var broker = require("./lib/broker")
var cstorage = require('./lib/storage').createStorage
global.storage = cstorage()
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.timeout = 100000000000;
/**
 * Normalize a port into a number, string, or false.
 */

var io = require("socket.io").listen(server);
io.sockets.on('connection', function(socket){
  var id = socket.id;
  socket.on('register', function(msg){
    socket.emit('register1',broker.register(msg))
  });

  socket.on('statuson', function(msg){
    broker.statuson(msg,socket)
  });

  socket.on('disconnect',function(){
    console.log(222222)
    broker.statusoff(id)
  });
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}