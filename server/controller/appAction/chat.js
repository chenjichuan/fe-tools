const { userSql } = require('../../sql/common');
const {sessionCheck} = require('../../lib/index');
/***
 *  查询用户
 * **/
const getUserCallback = async function (req, res) {
  const userInstance = new userSql(global.INSTANCE);
  // 未过期执行
  sessionCheck(req).then(async () => {
    // const { id } = req.body
    userInstance.findAll().then((data) => {
      res.json({code: 0, data})
    }, (err) => {
      res.json({code: -1, data: err})
    })
  }, () => {
    res.json({code: -2, message: '登录过期'})
  })
};
module.exports  = {
  getUserCallback,
}
