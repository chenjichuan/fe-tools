import Vue from 'vue'
import VueSocketio from 'vue-socket.io'

Vue.use(new VueSocketio({
  debug: true,
  connection: 'http://localhost',
}))
