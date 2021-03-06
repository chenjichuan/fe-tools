/***
 *
 * 公共数据查询
 *
 * ****/
const Sequelize = require('sequelize');

function GroupSql(sequelize) {
  const Group = sequelize.define('group', {
    name: Sequelize.STRING
  }, {
    freezeTableName: true,
    timestamps: false, // //去除createAt updateAt
  })
  this.create = async function ({name, id}) {
    var group = await Group.create({
      id,
      name,
    });
    return group;
  };
  this.find = async function () {
    //为了使用复杂一些的查询,如模糊查询等,需要引入Operator
    var target = await Group.findAll();
    return target
  }
}

// 查询user
function userSql(sequelize) {
  const User = sequelize.define('user', {
    group: Sequelize.INTEGER,
    nickname: Sequelize.STRING,
    username: Sequelize.STRING,
    userId: Sequelize.STRING,
    avatar: Sequelize.STRING,
  }, {
    freezeTableName: true,
    timestamps: false, // //去除createAt updateAt
  })

  this.find = async function ({group}) {
    //为了使用复杂一些的查询,如模糊查询等,需要引入Operator
    const swicher = {group: +group};
    const query = [
      swicher
    ]
    var target = await User.findAll({
      where: {
        $or: query
      }
    });
    return target
  }
  this.findAll = async function () {
    var target = await User.findAll();
    return target
  }
}

// members
function MemberSql(sequelize) {
  const Members = sequelize.define('members', {
    role: Sequelize.STRING,
    name: Sequelize.STRING,
  }, {
    freezeTableName: true,
    timestamps: false, // //去除createAt updateAt
  })

  this.find = async function ({role, pm_name, qa_name, rd_name, fe_name}) {
    //为了使用复杂一些的查询,如模糊查询等,需要引入Operator
    const query_or = [
      {role},
      {name: pm_name},
      {name: qa_name},
      {name: rd_name},
      {name: fe_name},
    ]
    var target = await Members.findAll({
      where: {
        $or: query_or
      }
    });
    return target
  };

  this.create = async function ({role, name}) {
    var members = await Members.create({
      role,
      name,
    });
    return members;
  };
  this.findOrCreate = async function ({pm_name, qa_name, rd_name, fe_name}, defaults) {
    const query_or = [
      {name: pm_name},
      {name: qa_name},
      {name: rd_name},
      {name: fe_name},
    ]
    Members.findOrCreate({
      where: {
        $or: query_or
      },
      defaults: defaults
    })
  }
}

// icon log
function IconLogSql(sequelize) {
  this.Icon = sequelize.define('icon_log', {
    filename: Sequelize.STRING,
    userId: Sequelize.STRING,
  }, {
    freezeTableName: true,
    timestamps: true, // //去除createAt updateAt
  })
}

IconLogSql.prototype.find = async function ({userId}) {
  var icons = this.Icon.findAll({
    where: {
      userId
    }
  });
  return icons;
};


IconLogSql.prototype.findOrCreate = function ({userId}, defaults) {
  //为了使用复杂一些的查询,如模糊查询等,需要引入Operator
  const query_or = [
    {userId},
  ];
  return new Promise((resole, reject) => {
    this.Icon.findOrCreate({
      where: {
        $or: query_or
      },
      defaults: {
        userId,
        ...defaults
      }
    })
      .spread((item, created) => {
        if (created === false) {
          const temp = JSON.stringify(item)
          item.update({filename: defaults.filename});
          resole(JSON.parse(temp))
        } else {
          resole()
        }
      });
  })
};

IconLogSql.prototype.create = async function ({userId, filename}) {
  var icon = await this.Icon.create({
    userId,
    filename,
  });
  return icon;
};
module.exports = {
  GroupSql,
  userSql,
  MemberSql,
  IconLogSql
}
