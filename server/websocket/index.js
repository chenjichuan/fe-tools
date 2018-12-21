var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const chalk = require('chalk');


io.on('connection', function(socket){
  console.log(chalk.green('a user connected!'));
  socket.emit('event', 222222222)
  socket.on('disconnect', function(){
    console.log(chalk.red('user disconnected!'));
    socket.emit('event', 222222222)
  });

  socket.on('event', function(){
    console.log(chalk.blue('get get get get!'));
  });
});

http.listen(3000, function(){
  console.log(chalk.blue('socket success!'));
});
