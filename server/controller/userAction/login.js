const {sessionStore} = require('../../session');
const UserInstance = require('../../sql/user');

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

/** ******登录登出****** **/
// 发起 POST /api/login 请求完成用户登录，并添加该用户到 req.session.authUser
async function loginCallback(req, res) {
  const {username, password} = req.body;

  const userOnly = () => {
    sessionStore.all(function (error, sessions) {
      for(var key in sessions) {
        if(username === sessions[key].authUser.username) {
          sessionStore.destroy(key);
          // global.socket.emit('otherlogin')
        }
      }
    })
  }

  // 用户信息查询实例
  const userInstance = new UserInstance(INSTANCE);

  if (username.length > 20 || password.length > 11) {
    return res.json({code: -4, error: '用户名最大20位，密码11位'})
  }

  if (!username || !password) {
    return res.json({code: -1, error: '账号或者密码错误！'})
  }

  userInstance.find({username}).then(findRes => {
    // 用户名不存在，创建
    if (!findRes.length) {
      userInstance.create({username, password}).then(onlyRes => {
        return success(req, res, onlyRes)
      })
    } else { // 存在，校验密码
      if(findRes[0].password === password) {
        userOnly();
        return success(req, res, findRes[0])
      } else {
        res.json({code: -1, error: '密码错误'});
      }
    }
  });
}

// 发起 POST /api/logout 请求注销当前用户，并从 req.session 中移除
const logoutCallback =  function (req, res) {
  sessionStore.destroy(req.session.id, () => {
    req.session.destroy(); //清除session
  })
  res.json({code: 0, ok: true})
};
  // const userInstance = new UserInstance(INSTANCE);

module.exports  = {
  loginCallback,
  logoutCallback,
}


