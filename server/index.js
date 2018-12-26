const express = require('express')
const fs = require("fs");
const path = require("path");
const compression = require('compression') // gzip 压缩
const bodyParser = require('body-parser') // body解析
const session = require('express-session') // session
const consola = require('consola') // 美化打印模块
const {sessionStore} = require('./session');

const {Nuxt, Builder} = require('nuxt')
const Sequelize = require('sequelize');
const mysqlInit = require('./sql/connect');

// 用户信息登录等等处理
const userAction = require('./controller/userAction')
// 业务逻辑
const apprAction = require('./controller/appAction')
// 图片上传
const imgUpload = require('./controller/uploadAction')

const app = express()
const host = process.env.HOST || '0.0.0.0';

//使用compression
app.use(compression());

// websocket
require('./websocket');

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

let port = '';
if (config.dev) {
  port = process.env.PORT || 3000
} else {
  port = 80;
}

app.set('port', port) // 端口设置

// Body parser，用来封装 req.body
app.use(bodyParser.json());

// 映射图片目录
app.use(express.static(__dirname + '/../files_upload/icons'));

app.use('/sw', express.static(__dirname + '/sw'));

// session 设置 Sessions 来创建 req.session
var sess = {
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {maxAge: 60000 * 60 * 2} // 120分钟
}
app.use(session(sess))

if (!config.dev) {
  app.set('trust proxy', 1) // trust first proxy
  // serve secure cookies
}

async function userActions() {
  userAction(app)
}

async function appActions() {
  imgUpload(app, global.INSTANCE)
  apprAction(app);
}

async function serviceWorker() {
  let filenames = require('./lib').getJsonFiles(__dirname + '/../.nuxt/dist/client');
  filenames = filenames.map(item => {
    if(/png|jpg|svg/.test(item)) {
      return `'/_nuxt/img/${item}'`
    } else if(/woff|ttf/.test(item)) {
      return `'/_nuxt/fonts/${item}'`
    } else {
      return `'/_nuxt/${item}'`
    }
  });
  const tarString = "var cacheList = ['/home', '/login', '/index'," + filenames.toString() + '];';
  var source = fs.readFileSync(path.join(__dirname, "/sw/swbk.js"));
  var target = path.join(__dirname, "/sw/sw.js");
  fs.writeFileSync(target, tarString)
  fs.appendFileSync(target, source);
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

  /** ******监听server************ **/
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })

}

async function todo() {
  //初始化数据库
  global.INSTANCE = await mysqlInit(Sequelize);  //数据库主实例
  // 用户信息
  await userActions()
  // 业务处理
  await appActions()
  // 处理service worker
  if (!config.dev) {
    await serviceWorker()
  }
  // 渲染页面
  await start()
}

todo()
