const Sequelize = require('sequelize');
const {uuid} = require('../lib/index')

function UserSql(sequelize) {
  this.User = sequelize.define('user', {
    userId: Sequelize.STRING,
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    group: Sequelize.INTEGER,
    avatar: Sequelize.STRING,
    nickname: Sequelize.STRING,
  }, {
    freezeTableName: true,
    // timestamps: false, // //去除createAt updateAt
  })
}

UserSql.prototype.create = async function ({username, password, avatar}) {
  var user = await this.User.create({
    userId: uuid(8, 10).toString(),
    username,
    password,
    avatar
  });
  return user;
};
UserSql.prototype.find = async function ({id, userId, username, password}) {
  //为了使用复杂一些的查询,如模糊查询等,需要引入Operator
  const swicher = {username};
  if (password) {
    swicher['password'] = password
  }
  const query = [
    {id},
    {userId},
    swicher
  ]
  var target = await this.User.findAll({
    where: {
      $or: query
    }
  });
  return target
}

UserSql.prototype.edit = async function ({userId}, data) {
  var resault = await this.User.update(data, {
    where: {
      userId
    }
  });
  return resault
}
module.exports = UserSql
