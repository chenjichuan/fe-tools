var fs = require('fs');
var path = require('path');
const {sessionStore} = require('../../sessionStore');
const {sessionCheck} = require('../../lib/index')
const User = require('../../sql/user');
const { GroupSql, IconLogSql } = require('../../sql/common');
function success(req, res, [sqlRes]) {
  let data = {}
  if (sqlRes) {
    data = {
      nickname: sqlRes.nickname,
      username: sqlRes.username,
      avatar: sqlRes.avatar,
      group: sqlRes.group,
    }
  }
  return res.json({code: 0, data})
}
const getGroupCallback = async function (req, res) {
  // 组别数据查询实例
  const groupSql = new GroupSql(global.INSTANCE);
  const {authUser: {group}} = req.session
  const data = await groupSql.find()
  const truly = data.filter(item => {
    if (+group === 100) {
      return true
    }
    else {
      return +item.id !== 100
    }

  })
  res.json({code: 0, data: truly})
};

const getCurrentUserCallback =  async function (req, res) {
  // 组别数据查询实例
  const user = new User(global.INSTANCE);
  // 未过期执行
  sessionCheck(req).then(async () => {
    const {authUser: {userId}} = req.session
    const reault = await user.find({userId})
    success(req, res, reault)
  }, () => {
    res.json({code: -2, message: '登录过期'})
  })
};

const updateUserInfoCallback =  async function (req, res) {
  // 组别数据查询实例
  const user = new User(global.INSTANCE);
  const iconSql = new IconLogSql(global.INSTANCE);
  // 未过期执行
  sessionCheck(req).then(async () => {
    const {authUser: {userId}} = req.session
    const [reault] = await user.edit({userId}, req.body)
    if (reault) {
      req.session.authUser.avatar = req.body.avatar
      req.session.authUser.group = req.body.group
      req.session.authUser.nickname = req.body.nickname;
      sessionStore.set(req.session.id, req.session, () => {});

      // var locaIcondir = path.resolve(__dirname + '/../../../files_upload/icons/');
      if(req.body.avatar) {
        iconSql.find({userId}).then(([icon_log]) => {
            if(icon_log.filename_current && icon_log.filename) {
              console.log(icon_log.filename)
              fs.unlink(icon_log.filename, () => {
                iconSql.findOrCreate({userId}, {filename: icon_log.filename_current})
              });
            }
        })
      }
    }
    let code = 0;
    reault ? code = 0 : code = -1
    res.json({code, message: reault})
  }, () => {
    res.json({code: -2, message: '登录过期'})
  })
}

module.exports = {
  getCurrentUserCallback,
  getGroupCallback,
  updateUserInfoCallback,
}

