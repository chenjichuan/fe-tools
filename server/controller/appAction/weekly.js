const {sessionCheck} = require('../../lib/index')
var qs = require('qs');

const weekly = (app, weeklyInstance, memberSql, projectSql) => {
  app.get('/api/getMembers', async function (req, res) {
    // const {authUser: {group}} = req.session;
    const { role } = qs.parse(req.query);
    if(!role) {
      return res.json({code: 0, data: []})
    }
    const data = await memberSql.find({role})

    res.json({code: 0, data: data})
  })

  app.get('/api/getWeekly', async function (req, res) {
    // 未过期执行
    sessionCheck(req).then(async () => {
      const { userId } = qs.parse(req.query);
      const { authUser: { group, username, nickname } } = req.session
      const reault = await weeklyInstance.find({ group, userId })
      const obj = {}
      reault.forEach(item => {
        if(nickname) {
          if(item.owner !== nickname) {
            item.owner = nickname;
            weeklyInstance.edit({id: item.id}, { owner: nickname})
          }
        } else {
          if(item.owner !== username) {
            item.owner = username;
            weeklyInstance.edit({id: item.id}, { owner: username})
          }
        }

        if(!obj[item.project_id]) {
          obj[item.project_id] = new Array(item);
        } else {
          obj[item.project_id].push(item)
        }
      })
      let data = []
      for(var key in obj) {
        data = data.concat(obj[key])
      }
      res.json({code: 0, data})
    }, () => {
      res.json({code: -2, message: '登录过期'})
    })
  })

  /***
   *  新增周报
   * **/

  app.post('/api/addWeekly', async function (req, res) {
    // 未过期执行
    sessionCheck(req).then(async () => {
      const { authUser: { group, userId, nickname, username } } = req.session
      const { project_id, pm_name, qa_name, rd_name, fe_name } = req.body
      // members 表中么有就添加
      const memberRes = await memberSql.find({pm_name, qa_name, rd_name, fe_name})
      if(!memberRes.length) {
        if(pm_name) {
          memberSql.create({role: 'pm', name: pm_name})
        }
        if (qa_name) {
          memberSql.create({role: 'qa', name: qa_name})
        }
        if (rd_name) {
          memberSql.create({role: 'rd', name: rd_name})
        }
        if (fe_name) {
          memberSql.create({role: 'fe', name: fe_name})
        }
      }

      const [ proRes ] = await projectSql.find({id: project_id})
      weeklyInstance.create(req.body, { group, userId, owner: nickname || username, project_name: proRes.name })
        .then(data => {
          res.json({code: 0, data})
        }, (err) => {
          res.json({code: -5, errors: err.errors})
        })
    }, () => {
      res.json({code: -2, message: '登录过期'})
    })
  })

  /***
   *  删除周报
   * **/
  app.post('/api/delWeekly', async function (req, res) {
    // 未过期执行
    sessionCheck(req).then(async () => {
      const { id } = req.body
      const data = await weeklyInstance.del({ id })
      if(data === 1)
        res.json({code: 0, data})
      else
        res.json({code: -1, data})
    }, () => {
      res.json({code: -2, message: '登录过期'})
    })
  })

  /***
   *  编辑周报
   * **/
  app.post('/api/editWeekly', async function (req, res) {
    // 未过期执行
    sessionCheck(req).then(async () => {
      const { id, project_id } = req.body
      const [ proRes ] = await projectSql.find({id: project_id})
      const params = {
        ...req.body,
        project_name: proRes.name
      }
      const data = await weeklyInstance.edit({ id }, params)
      if(data.length)
        res.json({code: 0, data: req.body})
      else
        res.json({code: -1, data})
    }, () => {
      res.json({code: -2, message: '登录过期'})
    })
  })
}
module.exports = weekly
