import io from 'socket.io-client';
let isEnv = !(process.env.NODE_ENV === 'production')
var socket = io(isEnv ? 'http://localhost:8000' : 'http://47.99.215.225:8000');
socket.on('connect', function(){
  console.log('%c client connected！','color:green');
});
socket.on('disconnect', function(){
  console.log('%c client disconnect！','color:red');
});
window.io = io;
window.socket = socket;
