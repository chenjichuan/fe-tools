var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
const { IconLogSql } = require('../../sql/common')
const { getLocaIp } = require('../../lib')

const imgUpload = (app, INSTANCE) => {
  // 用户信息查询实例
  const iconSql = new IconLogSql(INSTANCE);
  app.post('/api/uploadImg', (req, res) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = __dirname + '../../../../files_upload/icons';
    form.keepExtensions = true; // 包含原始属性的扩展名
    form.type = 'multipart';
// form.maxFieldsSize = 1 * 1024 * 1024; //单个拆分文件的大小 1M
// form.maxFields = 1000; // 其他参数限制
    form.maxFileSize = 10 * 1024 * 1024; //限制上传文件的大小 10M
    form.hash = true;

    form.parse(req, function (err, fields, files) {
      const { origin } = req.headers;
      /*fields:表示所有的域,就是和input相关的东西包括 checkbox radioBox
      * files:表示所有的和上传文件相关的内容*/
      if (err) {
        throw err;
        return;
      }

      const img_basename = path.basename(files.image.path);
      if(!files.image){ // 非图片
        fs.unlink(files.image.path, () => {
          return res.json({code: -1, data: '图片上传失败'})
        })
        return
      }
      var filename = img_basename.split('_')[1];
      var newPath = form.uploadDir + '/' + filename;

      fs.renameSync(files.image.path, newPath); // 重命名
      let protol = 'http://'
      if(/https/.test(origin)) {
        protol = 'https://'
      }
      const host = process.env.NODE_ENV === 'production' ? '47.99.215.225' :  getLocaIp();
      let port = origin.split('//')[1].split(':')[1];
      if(port) {
        port = ':' + port
      }
      // 本地磁盘是否保留
      const {authUser: {userId}} = req.session;
      // 更新日志
      iconSql.findOrCreate({userId}, {filename}).then(data => {
        if(data) {
          // 更新了;
          // 删除旧的icon
          fs.unlink(form.uploadDir + '/' + data.filename, new Function);
        }
      })
      const data = {
        filename,
        path: `/${filename}`,
        url: protol + host + port + `/${filename}`,
      }
      // userSqlInstance.edit({userId}, {avatar: data.url});

      return res.json({code: 0, data})
    });


    // form.on('progress', function(bytesReceived, bytesExpected) {
    //   console.log('field', bytesReceived, bytesExpected)
    // });
    // // form.on('end')
    // form.on('error', function(err) {
    //   return res.json({code: -1, data: err})
    // });
  })
}

module.exports = imgUpload
