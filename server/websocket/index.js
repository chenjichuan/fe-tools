var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const chalk = require('chalk');

io.on('connection', function(client){
  console.log(chalk.green('a user connected!'));
  console.log(chalk.green(client.id));
  client.on('event', data => { /* … */ });

  client.on('disconnect', () => {
    console.log(chalk.red('user disconnected!'));
  });
});

http.listen(3000, function(){
  console.log(chalk.blue('socket success!'));
});
