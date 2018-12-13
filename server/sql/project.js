const Sequelize = require('sequelize');

function ProjectSql (sequelize) {
  const Project = sequelize.define('project', {
    name: Sequelize.STRING,
    group: Sequelize.INTEGER,
    description: Sequelize.STRING
  }, {
    freezeTableName: true,
    timestamps: true
  })
  this.create = async function({name, group, description}) {
    var project = await Project.create({
      name,
      group,
      description
    });
    return project;
  };
  this.find = async function ({ group, id }) {
    //为了使用复杂一些的查询,如模糊查询等,需要引入Operator
    const swicher = {group};
    const query = [
      swicher,
      {id}
    ]
    var target = await Project.findAll({
      where: {
        $or: query
      },
      order: 'updatedAt DESC'
    });
    return target
  }

  this.edit = async ({ id }, data) => {
    var resault = await Project.update(data, {
      where: {
        id
      }
    });
    return resault
  }

  this.del = async ({ id }) => {
    var resault = await Project.destroy({
      where: {
        id
      }
    });
    return resault
  }
}

module.exports = ProjectSql
