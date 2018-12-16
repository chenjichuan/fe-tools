const fs = require('fs')
// fs.readFile('../static/menu.js', 'utf8', function(err, data){
//   console.log(data);
// });
const menu = (app) => {
  /** ******获取menu****** **/
  app.get('/api/getMenuList', function (req, res) {
    const {authUser: {group}} = req.session;
    fs.readFile('server/static/menu.json', 'utf8', function (err, data) {
      const objData = JSON.parse(data);
      let list = objData
      if (+group === 100 || !group) { //游客权限
        list = objData.filter(item => {
          if(item.name === 'home') return true
          else return  item.group === '100'
        })
      }
      res.json({code: 0, data: { list }})
    });
  })
}

module.exports = menu
