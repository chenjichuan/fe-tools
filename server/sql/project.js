const Sequelize = require('sequelize');

function ProjectSql(sequelize) {
  this.Project = sequelize.define('project', {
    name: Sequelize.STRING,
    group: Sequelize.INTEGER,
    test_url: Sequelize.INTEGER,
    pro_url: Sequelize.INTEGER,
    app_test_url: Sequelize.INTEGER,
    app_pro_url: Sequelize.INTEGER,
    git_url: Sequelize.INTEGER,
    description: Sequelize.STRING
  }, {
    freezeTableName: true,
    timestamps: true
  })
}

ProjectSql.prototype.create = async function (data) {
  var project = await this.Project.create({
    ...data
  });
  return project;
};
ProjectSql.prototype.find = async function ({group, id}) {
  //为了使用复杂一些的查询,如模糊查询等,需要引入Operator
  const swicher = {group};
  const query = [
    swicher,
    {id}
  ]
  var target = await this.Project.findAll({
    where: {
      $or: query
    },
    order: 'updatedAt DESC'
  });
  return target
}

ProjectSql.prototype.edit = async function ({id}, data) {
  var resault = await this.Project.update(data, {
    where: {
      id
    }
  });
  return resault
}

ProjectSql.prototype.del = async function ({id}) {
  var resault = await this.Project.destroy({
    where: {
      id
    }
  });
  return resault
}
module.exports = ProjectSql
