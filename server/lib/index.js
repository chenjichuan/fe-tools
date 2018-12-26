var fs = require('fs');
var path = require('path')
var join = path.join;
const object =  {
  sessionCheck(req, Store) {
    const { authUser } = req.session;
    return new Promise((resolve, reject) => {
      if (authUser) {
        resolve()
      } else {
        Store.destroy(req.session.id, () => {
          req.session.destroy(); //清除session
        })
        reject()
      }
    })
  },
  uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  },

  getLocaIp() {
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
      var iface = interfaces[devName];
      for(var i=0;i<iface.length;i++){
        var alias = iface[i];
        if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
          return alias.address
        }
      }
    }
  }

}

object.getJsonFiles = function (jsonPath) {
  let jsonFiles = [];

  function findJsonFile(pather) {
    let files = fs.readdirSync(pather);
    files.forEach(function (item) {
      let fPath = join(pather, item);
      let stat = fs.statSync(fPath);
      if (stat.isDirectory() === true) {
        findJsonFile(fPath);
      }
      if (stat.isFile() === true) {
        jsonFiles.push(path.basename(fPath));
      }
    });
  }
  try {
    findJsonFile(jsonPath);
  } catch (e) {}
  return jsonFiles
}



module.exports = object
