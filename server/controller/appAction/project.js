const {sessionCheck} = require('../../lib/index')
const ProjectInstance = require('../../sql/project'); // 数据库实例


const getProjectCallback = function (req, res)  {
  const projectInstance = new ProjectInstance(global.INSTANCE);

  // 未过期执行
  sessionCheck(req).then(async () => {
    const { authUser: { group, userId } } = req.session
    const reault = await projectInstance.find({ group })
    const data = [];

    reault.forEach(item => {
      const newItem = JSON.parse(JSON.stringify(item));
      delete newItem['createdAt'];
      delete newItem['updatedAt'];
      if (item.group == group) {
        data.push(newItem)
      }
    })
    res.json({code: 0, data})
  }, () => {
    res.json({code: -2, message: '登录过期'})
  })
}

/***
 *  新增项目
 * **/
const addProjectCallback = async (req, res) => {
  const projectInstance = new ProjectInstance(global.INSTANCE);

  // 未过期执行
  sessionCheck(req).then(async () => {
    // const { name, description, test_url, pro_url, git_url } = req.body
    const { authUser: { group } } = req.session
    const data = await projectInstance.create( {group, ...req.body});
    const newData = JSON.parse(JSON.stringify(data));
    delete newData['createdAt'];
    delete newData['updatedAt'];
    res.json({code: 0, data: newData})
  }, () => {
    res.json({code: -2, message: '登录过期'})
  })
}
/***
 *  删除项目
 * **/
const delProjectCallback = async function (req, res) {
  const projectInstance = new ProjectInstance(global.INSTANCE);

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
}

/***
 *  编辑项目
 * **/
const editProjectCallback = async function (req, res) {
  const projectInstance = new ProjectInstance(global.INSTANCE);

  // 未过期执行
  sessionCheck(req).then(async () => {
    const { id } = req.body
    projectInstance.edit({ id }, req.body).then(() => {
      res.json({code: 0, data: req.body})
    }, (err) => {
      res.json({code: -1, data: err})
    })
  }, () => {
    res.json({code: -2, message: '登录过期'})
  })
};


module.exports  = {
  getProjectCallback,
  addProjectCallback,
  delProjectCallback,
  editProjectCallback
}
