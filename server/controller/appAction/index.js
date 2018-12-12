const ProjectInstance = require('../../sql/project'); // 数据库实例
const projectTodo = require('./project'); // 用户项目模块

const WeeklyInstance = require('../../sql/weekly'); // 数据库实例
const weeklyTodo = require('./weekly'); // 用户项目模块
const menuTodo = require('./menu');
const { memberSql } = require('../../sql/common')


function main(app, INSTANCE) {
  // menu相关
  menuTodo(app);

  // 项目模块实例
  const projectInstance = new ProjectInstance(INSTANCE)
  projectTodo(app, projectInstance);

  // 周报模块实例
  const weeklyInstance = new WeeklyInstance(INSTANCE)
  weeklyTodo(app, weeklyInstance, new memberSql(INSTANCE), projectInstance);


}

module.exports = main
