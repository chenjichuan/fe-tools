const nws = require('nodejs-websocket');

const nwsServer = nws.createServer(function (connect) {

  /**
   * 消息
   */
  connect.on('text', function (txt) {
    console.log('onText =:|======> : ' + txt);
  });

  /**
   * 某次的连接是否关闭
   */
  connect.on('close', function (code) {
    console.info('onClose =:|======> code: ' + code);
  });

  connect.on('error', function (code, reason) {
    console.error('onError =:|======> code: ' + code + ' reason: ' + reason);
  });

});

/**
 * websocket 服务监听 已经启动
 */
nwsServer.on('listening', function () {
  console.log('nws.js onListening =:|======>  初始化 nws');
});

/**
 * websocket 客户端链接事件
 */
nwsServer.on('connection', function (connect) {
  console.log('nws.js onConnection =:|======> Your connection key is: ' + connect.key);
  connect.send('Your connection key is: ' + connect.key);
  setInterval(() => {
    connect.send('你好我是 Server' + new Date());
  }, 5000);
});

nwsServer.listen(8080);

module.exports = nwsServer;
