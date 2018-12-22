var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const chalk = require('chalk');
const warning = chalk.keyword('orange');
const error = chalk.bold.red;
// console.log(warning(data));
// socket.broadcast.emit('freshMembers', Array.from(connectMem))
const fs = require('fs')

try {
  global.socket.removeAllListeners();
  global.io.sockets.removeAllListeners();
} catch (e) {
}

// 全局Io
global.io = io;
var connectMem = new Set(); //加入的组员
var thisUser = '';
var groupMsg = [];

function roomEnter(socket, data, callback) {
  connectMem.add(data.userId);
  // 私有room
  socket.join(data.userId, () => {
    callback((JSON.stringify(socket.rooms)))
  });
  socket.broadcast.emit('freshMembers', Array.from(connectMem));
}

function roomLeave(socket, data) {
  connectMem.delete(data.userId);
  socket.leave('room001');
  socket.leave(data.userId);
  socket.to('room001').emit('freshMembers', Array.from(connectMem));
}

io.on('connection', function (socket) {
  console.log(chalk.green('a user connected!'));
  // 全局socket
  global.socket = socket;
  // 断开连接
  socket.on('disconnect', () => {
    console.log(chalk.red('user disconnected!'));
    roomLeave(socket, {userId: thisUser})
  });

  /***
   * *事件
   * *************************************/
  // 成员加入room001组 共有room
  socket.join('room001', () => {

  });
  // 上线
  socket.on('online', (userId, callback) => {
    thisUser = userId;
    fs.writeFileSync('server/static/members.json', {[userId]: ''});
    roomEnter(socket, {userId}, callback)
  });
  // 离线
  socket.on('offline', userId => {
    roomLeave(socket, {userId})
  });
  // 获取所有人
  // socket.on('getAll', (name, fn) => {
  //   console.log('hahaah:')
  //   fn(socket.rooms);
  // });
  // 群发消息
  socket.on('dispach message', (data, callback) => {
    // 转发
    socket.to('room001').emit('get message form all', data);
  });
});


http.listen(8000, function () {
  console.log(chalk.blue('socket success!'));
});
