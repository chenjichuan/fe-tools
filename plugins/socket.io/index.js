import Vue from 'vue'
import io from 'socket.io-client';
let isEnv = !(process.env.NODE_ENV === 'production')

export default function () {
  var socket = io(isEnv ? 'http://localhost:8000' : 'http://47.99.215.225:8000');
  window.io = io;
  window.socket = socket;

  socket.on('connect', function(){
    console.log('%c client connected！','color:green');
  });
  socket.on('disconnect', function(){
    console.log('%c client disconnect！','color:red');
  });

  socket.on('kickout', function(){
    console.log('%c 被迫下线！','color:red');
    Vue.prototype.$Notice.info({
      title: '下线',
      desc: '账号在其他地点登录，请重新登录',
    });
    let timer = setTimeout(() => {
      clearTimeout(timer);
      location.href = '/login'
    }, 2000)
  });
}




