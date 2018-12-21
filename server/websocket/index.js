var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const chalk = require('chalk');
const warning = chalk.keyword('orange');
const error = chalk.bold.red;

var connectMem = new Set();
let thisUser = '';

io.on('connection', function(socket){
  console.log(chalk.green('a user connected!'));
  // const socketId = socket.id;
  global.socket = socket;
  // socket.on('disconnecting', () => {
  //   let rooms = Object.keys(socket.rooms);
  //   console.log(error(rooms));
  // });

  // let userId = ''

  socket.on('online', userId => {
    // console.log(warning(data));
    connectMem.add(userId);
    socket.broadcast.emit('freshMembers', Array.from(connectMem))
  });

  socket.on('offline', userId => {
    thisUser = userId
    connectMem.delete(userId);
    socket.broadcast.emit('freshMembers', Array.from(connectMem))
  });

  socket.on('disconnect', () => {
    console.log(chalk.red('user disconnected!'));
    connectMem.delete(thisUser);
    socket.broadcast.emit('freshMembers', Array.from(connectMem))
  });
});

http.listen(8000, function(){
  console.log(chalk.blue('socket success!'));
});
