var qs = require('qs');
const {sessionCheck} = require('../../lib/index')
const {MemberSql} = require('../../sql/common')
const ProjectInstance = require('../../sql/project');
const WeeklyInstance = require('../../sql/weekly');


const getMembersCallback = async function (req, res) {
  // 用户表
  const memberSql = new MemberSql(global.INSTANCE);
  const {role} = qs.parse(req.query);
  if (!role) {
    return res.json({code: 0, data: []})
  }
  const data = await memberSql.find({role})

  res.json({code: 0, data: data})
}
/***
 *  查询周报
 * **/
const getWeeklyCallback = async (req, res) => {
  // 周报模块实例
  const weeklyInstance = new WeeklyInstance(global.INSTANCE);
  // 未过期执行
  sessionCheck(req).then(async () => {
    // const { userId } = qs.parse(req.query);
    const {authUser: {group, username, nickname, userId}} = req.session
    const reault = await weeklyInstance.find({group})
    const obj = {}
    reault.forEach(v => {
      const item = JSON.parse(JSON.stringify(v));
      delete item['createdAt'];
      delete item['updatedAt'];
      if (userId === item.userId) {
        if (nickname) {
          if (item.owner !== nickname) {
            item.owner = nickname;
            weeklyInstance.edit({id: item.id}, {owner: nickname})
          }
        } else {
          if (item.owner !== username) {
            item.owner = username;
            weeklyInstance.edit({id: item.id}, {owner: username})
          }
        }
      }

      if (!obj[item.project_id]) {
        obj[item.project_id] = new Array(item);
      } else {
        obj[item.project_id].push(item)
      }
    })
    let data = []
    for (var key in obj) {
      data = data.concat(obj[key])
    }
    res.json({code: 0, data})
  }, () => {
    res.json({code: -2, message: '登录过期'})
  })
}

/***
 *  新增周报
 * **/
function addMember({pm_name = '', qa_name = '', rd_name = '', fe_name = ''}) {
  // 用户表
  const memberSql = new MemberSql(global.INSTANCE);
  // members 表中么有就添加
  if (pm_name) {
    memberSql.findOrCreate({ pm_name }, {role: 'pm', name: pm_name})
  }
  if (qa_name) {
    memberSql.findOrCreate({ qa_name }, {role: 'qa', name: qa_name})
  }
  if (rd_name) {
    memberSql.findOrCreate({ rd_name }, {role: 'rd', name: rd_name})
  }
  if (fe_name) {
    memberSql.findOrCreate({ fe_name }, {role: 'fe', name: fe_name})
  }
}

const addWeeklyCallback = async function (req, res) {

  // 项目表
  const projectSql = new ProjectInstance(global.INSTANCE);
  // 周报模块实例
  const weeklyInstance = new WeeklyInstance(global.INSTANCE);
  // 未过期执行
  sessionCheck(req).then(async () => {
    const {authUser: {group, userId, nickname, username}} = req.session
    const {project_id, pm_name, qa_name, rd_name, fe_name} = req.body
    // members 表中么有就添加
    addMember({pm_name, qa_name, rd_name, fe_name})

    const [proRes] = await projectSql.find({id: project_id})
    weeklyInstance.create(req.body, {group, userId, owner: nickname || username, project_name: proRes.name})
      .then(data => {
        res.json({code: 0, data})
      }, (err) => {
        res.json({code: -5, errors: err.errors})
      })
  }, () => {
    res.json({code: -2, message: '登录过期'})
  })
}

/***
 *  编辑周报
 * **/
const editWeeklyCallback = async function (req, res) {
  // 项目表
  const projectSql = new ProjectInstance(global.INSTANCE);
  // 周报模块实例
  const weeklyInstance = new WeeklyInstance(global.INSTANCE);
  // 未过期执行
  sessionCheck(req).then(async () => {
    const {id, project_id, pm_name, qa_name, rd_name, fe_name} = req.body
    const [proRes] = await projectSql.find({id: project_id})
    const params = {
      ...req.body,
      project_name: proRes.name
    }
    const data = await weeklyInstance.edit({id}, params)
    if (data.length) {
      // members 表中么有就添加
      addMember({pm_name, qa_name, rd_name, fe_name})
      return res.json({code: 0, data: req.body})
    }
    else
      return res.json({code: -1, data})
  }, () => {
    return res.json({code: -2, message: '登录过期'})
  })
}

/***
 *  删除周报
 * **/
const delWeeklyCallback = async function (req, res) {
  // 周报模块实例
  const weeklyInstance = new WeeklyInstance(global.INSTANCE);
  // 未过期执行
  sessionCheck(req).then(async () => {
    const {id} = req.body
    const data = await weeklyInstance.del({id})
    if (data === 1)
      res.json({code: 0, data})
    else
      res.json({code: -1, data})
  }, () => {
    res.json({code: -2, message: '登录过期'})
  })
}

module.exports = {
  getMembersCallback,
  getWeeklyCallback,
  addWeeklyCallback,
  editWeeklyCallback,
  delWeeklyCallback,
}
