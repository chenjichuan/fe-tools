export default class WS {

  constructor(success) {
    this.intervalId;
    this.main();
    this.success = success;
  }

  connect() {
    // this.webSocket = new WebSocket(`ws://${this.url}`);
    this.webSocket = new WebSocket(`ws://0.0.0.0:8080/smartcity/statistical/websocket`);
  }

  onopen() {
    this.webSocket.onopen = (evt) => {
      console.log('%c%s', 'color:purple;', '=============服务器已连接=============');
      if (this.intervalId) {
        window.clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.success(this);
    }
  }

  onclose() {
    this.webSocket.onclose = (evt) => {
      console.log('%c%s', 'color:blue;', '=============网络连接已断开=============');
      if (!this.intervalId) {
        this.intervalId = setInterval(() => {
          console.log('%c%s', 'color:blue;', '=============正在尝试重新连接=============');
          this.main();
        }, 20000);
      }
    }
  }

  onerror() {
    this.webSocket.onerror = (evt) => {
      console.log('%c%s', 'color:red;', '=============连接异常=============');
    };
  }

  onmessage(callback) {
    this.webSocket.onmessage = (evt) => {
      // console.log('%c%s', 'color:green;', evt.data);
      callback(evt.data);
    }
  }

  send(info) {
    this.webSocket.send(info);
  }

  main() {
    this.connect();
    this.onopen();
    this.onclose();
    this.onerror();
  }

}
