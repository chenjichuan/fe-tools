/***
 *
 * 数据库文件配置
 * 本地环境跟线上环境区分
 * ****/
// const config = {
//   database: 'fe_tools',
//   username: 'root',
//   password: 'admin123',
//   host: '127.0.0.1',
//   port: 3306
// };
let isEnv = !(process.env.NODE_ENV === 'production')

let config = ''
if (isEnv) {
  config = {
    database: 'feTools',
    user: 'web',
    username: 'web',
    password: 'admin123',
    host: '0.0.0.0',
    port: 3306
  }
} else {
  config = {
    database: 'feTools',
    user: 'web',
    username: 'web',
    password: 'admin123',
    host: '0.0.0.0',
    port: 3306
  }
}

module.exports = {
  config
}
