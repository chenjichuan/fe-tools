import io from 'socket.io-client';
let isEnv = !(process.env.NODE_ENV === 'production')
var socket = io(isEnv ? 'http://localhost:3000' : 'http://47.99.215.225');

socket.on('connect', function(){
  console.log('client connected');
});
socket.on('event', function(data){
  console.log(data)
});
socket.on('disconnect', function(){
  console.log('client disconnect');
});

window.io = io;
window.socket = socket;
