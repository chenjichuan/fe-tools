const {sessionStore} = require('../../sessionStore');
const {sessionCheck} = require('../../lib/index')

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

const setting = (app, user, groupSql) => {
  app.get('/api/getGroup', async function (req, res) {
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
  })

  app.get('/api/getCurrentUser', async function (req, res) {
    // 未过期执行
    sessionCheck(req).then(async () => {
      const {authUser: {userId}} = req.session
      const reault = await user.find({userId})
      success(req, res, reault)
    }, () => {
      res.json({code: -2, message: '登录过期'})
    })
  })

  app.post('/api/updateUserInfo', async function (req, res) {
    // 未过期执行
    sessionCheck(req).then(async () => {
      const {authUser: {userId}} = req.session
      const [reault] = await user.edit({userId}, req.body)
      if (reault) {
        req.session.authUser.avatar = req.body.avatar
        req.session.authUser.group = req.body.group
        req.session.authUser.nickname = req.body.nickname
        sessionStore.set(req.session.id, req.session, () => {
        })
      }
      let code = 0;
      reault ? code = 0 : code = -1
      res.json({code, message: reault})
    }, () => {
      res.json({code: -2, message: '登录过期'})
    })
  })

}
module.exports = setting
