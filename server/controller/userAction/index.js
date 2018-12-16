const userLogin = require('./login')
const userSetting = require('./user_setting')

const apiRouter = require('../apiRouter');


function main(app) {
  app.post(apiRouter.user.login, userLogin.loginCallback);
  app.post(apiRouter.user.logout, userLogin.logoutCallback);

  // 用户设置
  app.get(apiRouter.getGroup, userSetting.getGroupCallback);
  app.get(apiRouter.user.getCurrentUser, userSetting.getCurrentUserCallback);
  app.post(apiRouter.user.updateUserInfo, userSetting.updateUserInfoCallback);

}

module.exports = main
