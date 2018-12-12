/**
 * 初始化数据库
 *  database: 'fe_tools'
 * **/
'use strict';
const { config } = require('./config');
const consola = require('consola')

// 使用Url连接2选1
// var sequelize = new Sequelize('mysql://root:admin123@localhost:3306/fe_tools');

const mysqlInit = (Sequelize) => {
  var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 30000
    },
    timestamps: false
    //最好关掉timestamps , 框架自动帮你添加时间到UpdatedAt上边
  });
  return new Promise((resolve, reject) => {
    // 验证链接
    sequelize
      .authenticate()
      .then(() => {
        resolve(sequelize)
        consola.ready({
          message: 'Connection has been established successfully.',
          badge: true
        })
      })
      .catch(err => {
        reject(err)
      });
  })
}

module.exports =  mysqlInit
