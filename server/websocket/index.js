var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


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

http.listen(9001, function(){
  console.log('socket listening on *:9001');
});
