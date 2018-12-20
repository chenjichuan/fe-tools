const projectTodo = require('./project'); // 项目模块
const weeklyTodo = require('./weekly'); // 用户项目模块
const chatTodo = require('./chat'); // 用户项目模块
const menuTodo = require('./menu');

const apiRouter = require('../apiRouter')

function main(app) {
  // menu相关
  menuTodo(app);

  // 项目
  app.get(apiRouter.project.getProject, projectTodo.getProjectCallback);
  app.post(apiRouter.project.addProject, projectTodo.addProjectCallback);
  app.post(apiRouter.project.editProject, projectTodo.editProjectCallback);
  app.post(apiRouter.project.delProject, projectTodo.delProjectCallback);

  // 周报
  app.get(apiRouter.getMembers, weeklyTodo.getMembersCallback);
  app.get(apiRouter.weekly.getWeekly, weeklyTodo.getWeeklyCallback);
  app.post(apiRouter.weekly.addWeekly, weeklyTodo.addWeeklyCallback);
  app.post(apiRouter.weekly.editWeekly, weeklyTodo.editWeeklyCallback);
  app.post(apiRouter.weekly.delWeekly, weeklyTodo.delWeeklyCallback);

  // chat
  app.get(apiRouter.getUsers, chatTodo.getUserCallback);
}

module.exports = main
