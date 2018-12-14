const {sessionCheck} = require('../../lib/index')

const project = (app, projectInstance) => {

// 发起 POST /api/logout 请求注销当前用户，并从 req.session 中移除
  app.get('/api/getProject', async function (req, res) {
    // 未过期执行
    sessionCheck(req).then(async () => {
      const { authUser: { group, userId } } = req.session
      const reault = await projectInstance.find({ group })
      const data = []
      reault.forEach(item => {
        if (item.group == group) {
          data.push(item)
        }
      })
      res.json({code: 0, data})
    }, () => {
      res.json({code: -2, message: '登录过期'})
    })
  })

  /***
   *  新增项目
   * **/

  app.post('/api/addProject', async function (req, res) {
    // 未过期执行
    sessionCheck(req).then(async () => {
      // const { name, description, test_url, pro_url, git_url } = req.body
      const { authUser: { group } } = req.session
      const data = await projectInstance.create( {group, ...req.body})
      res.json({code: 0, data})
    }, () => {
      res.json({code: -2, message: '登录过期'})
    })
  })

  /***
   *  删除项目
   * **/
  app.post('/api/delProject', async function (req, res) {
    // 未过期执行
    sessionCheck(req).then(async () => {
      const { id } = req.body
      const data = await projectInstance.del({ id })
      if(data === 1)
        res.json({code: 0, data})
      else
        res.json({code: -1, data})
    }, () => {
      res.json({code: -2, message: '登录过期'})
    })
  })

  /***
   *  编辑项目
   * **/
  app.post('/api/editProject', async function (req, res) {
    // 未过期执行
    sessionCheck(req).then(async () => {
      const { id } = req.body
      const data = await projectInstance.edit({ id }, req.body)
      if(data.length)
        res.json({code: 0, data: req.body})
      else
        res.json({code: -1, data})
    }, () => {
      res.json({code: -2, message: '登录过期'})
    })
  })
}
module.exports = project
