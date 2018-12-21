var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const chalk = require('chalk');


io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('event', 214563)
  socket.on('disconnect', function(){
    console.log('user disconnected');
    socket.emit('event', 213)
  });

  socket.on('get', function(){
    console.log('get get get get');
  });
});

http.listen(80, function(){
  console.log(chalk.blue('socket success!'));
});
