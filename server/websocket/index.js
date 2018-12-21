var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const chalk = require('chalk');
const warning = chalk.keyword('orange');
const error = chalk.bold.red;

io.on('connection', function(socket){
  console.log(chalk.green('a user connected!'));
  const socketId = socket.id;

  socket.on('disconnecting', () => {
    let rooms = Object.keys(socket.rooms);
    console.log(error(rooms));
  });

  socket.on('disconnect', () => {
    console.log(chalk.red('user disconnected!'));
  });

  let userId = ''
  socket.on('online', data => {
    console.log(warning(data));
    userId = data;
  });
});

http.listen(3000, function(){
  console.log(chalk.blue('socket success!'));
});
