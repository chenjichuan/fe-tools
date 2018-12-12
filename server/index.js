const express = require('express')
const consola = require('consola') // 美化打印模块
const bodyParser = require('body-parser') // body解析
const session = require('express-session') // session
const { sessionStore } = require('./sessionStore');

const {Nuxt, Builder} = require('nuxt')
const Sequelize = require('sequelize');
const mysqlInit = require('./sql/connect')

// 用户信息登录等等处理
const userAction = require('./controller/userAction')
// 业务逻辑
const apprAction = require('./controller/appAction')

const app = express()
const host = process.env.HOST || '0.0.0.0';

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

let port = '';
if (config.dev) {
  port = process.env.PORT || 3000
} else {
  port = 80;
}

app.set('port', port)


/****************
 * global data
 * **************/
let INSTANCE = '' //数据库主实例

async function userActions() {
  // Body parser，用来封装 req.body
  app.use(bodyParser.json())
  var sess = {
    secret: 'super-secret-key',
    resave: true,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {maxAge: 60000 * 10 * 6} // 60分钟
  }
  if (!config.dev) {
    app.set('trust proxy', 1) // trust first proxy
    // serve secure cookies
  }
// Sessions 来创建 req.session
  app.use(session(sess))

  userAction(app, INSTANCE)
}

async function appActions() {

  apprAction(app, INSTANCE);
}

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  /** ******监听************ **/
  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

async function todo() {
  //初始化数据库
  INSTANCE = await mysqlInit(Sequelize)
  // 用户信息
  await userActions()
  // 业务处理
  await appActions()
  // 渲染页面
  await start()
}

function makeuser() {
  const userTodo = new UserTodo(INSTANCE)
  userTodo.create({username: 'test', password: '123'})
}

todo()
