const { sessionStore } = require('../../sessionStore');
function success(req, res, sqlRes) {
  const data = {
    userId: sqlRes.userId,
    username: sqlRes.username,
    nickname: sqlRes.nickname,
    avatar: sqlRes.avatar,
    group: sqlRes.group,
  }
  sessionStore.destroy(req.session.id)// 重新登录乣清除旧的session
  req.session.authUser = data
  return res.json({code: 0, data})
}
const userFn = (app, userInstance) => {
  /** ******登录登出****** **/
// 发起 POST /api/login 请求完成用户登录，并添加该用户到 req.session.authUser
  app.post('/api/login', async function (req, res) {
    const {username, password} = req.body
    if(username.length > 20 || password.length > 11) {
      return res.json({code: -4, error: '用户名最大20位，密码11位'})
    }
    if (username && password) {
      // 用户名密码其中一个出错
      if (!reault.length) {
        // 用户名存在检验密码，用户名不存在直接创建
        if (username) {
          const onlyName = await userInstance.find({username})
          // 用户名不存在，创建
          if (!onlyName.length) {
            const onlyRes = await userInstance.create({username, password})
            return success(req, res, onlyRes)
          } else {
            res.json({code: -1, error: '密码错误'})
          }
        } else {
          res.json({code: -1, error: '账号或者密码错误'})
        }
        // res.status(401).json({error: 'Bad credentials'})
      } else {  // 用户名密码都真确，登录成功
        return success(req, res, reault[0])
      }
    } else {
      res.json({code: -1, error: '账号或者密码错误'})
    }
  })

// 发起 POST /api/logout 请求注销当前用户，并从 req.session 中移除
  app.post('/api/logout', function (req, res) {
    sessionStore.destroy(req.session.id, () => {
      req.session.destroy(); //清除session
    })
    res.json({code: 0, ok: true})
  })
}
module.exports = userFn

