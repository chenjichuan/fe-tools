// user实例 and 登录逻辑处理
const UserInstance = require('../../sql/user')
const userLogin = require('./login')
const userSetting = require('./user_setting')
const { GroupSql } = require('../../sql/common')


function main(app, INSTANCE) {
  // 组别数据查询实例
  const groupSqlInstance = new GroupSql(INSTANCE)
  // 用户信息查询实例
  const userSqlInstance = new UserInstance(INSTANCE)

  userLogin(app, userSqlInstance);
  userSetting(app, userSqlInstance, groupSqlInstance);

}

module.exports = main
