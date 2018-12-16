const Sequelize = require('sequelize');

function weekly (sequelize) {
  this.WEEKLY = sequelize.define('weekly', {
    userId: Sequelize.STRING,
    group: Sequelize.INTEGER,
    order: Sequelize.STRING,
    wiki_url: Sequelize.STRING,
    project_id: Sequelize.INTEGER,
    project_name: Sequelize.STRING,
    date_range: Sequelize.JSON,
    simulation_range: Sequelize.JSON,
    owner: Sequelize.STRING,
    fe_name: Sequelize.STRING,
    rd_name: Sequelize.STRING,
    pm_name: Sequelize.STRING,
    qa_name: Sequelize.STRING,
    description: Sequelize.STRING
  }, {
    freezeTableName: true
  });
}
weekly.prototype.create = async function(params, extra) {
  var Weekly = await this.WEEKLY.create({
    ...params,
    ...extra
  });
  return Weekly;
};
weekly.prototype.find = async function ({ userId, group }) {
  //为了使用复杂一些的查询,如模糊查询等,需要引入Operator
  let swicher_and = {userId, group};
  if(userId) {
    swicher_and = {userId, group};
  } else {
    swicher_and = {group};
  }
  const query_or = [
    swicher_and
  ]
  var target = await this.WEEKLY.findAll({
    // group: 'project_id', // 去重
    where: {
      $or: query_or
    },
    order: 'updatedAt DESC',
  });
  return target
}

weekly.prototype.edit = async ({ id }, data) => {
  var resault = await this.WEEKLY.update(data, {
    where: {
      id
    }
  });
  return resault
}

weekly.prototype.del = async ({ id }) => {
  var resault = await this.WEEKLY.destroy({
    where: {
      id
    }
  });
  return resault
}
module.exports = weekly
