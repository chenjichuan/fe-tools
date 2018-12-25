# 前端应用工具

> 一个轻量级全栈项目

<p align="center">
  <a href="http://ant.design">
    <img style="border-radius='4px'" width="200" src="http://47.99.215.225/logo-min.jpg">
  </a>
</p>

# view in  [example](http://47.99.215.225)


## Install

``` bash
# install dependencies
$ yarn install
$ or
$ npm install

# serve with hot reload at localhost:3000
$ yarn run dev
$ or
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```
    
    |-- .eslintrc.js
    |-- .gitignore
    |-- nuxt.config.js
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- api  公共api
    |   |-- index.js
    |-- assets 静态文件
    |   |-- css
    |   |   |-- global.less
    |   |   |-- mixins.scss
    |   |   |-- normalize.css
    |   |   |-- mixins
    |   |       |-- flex.scss
    |   |       |-- func.scss
    |   |       |-- var.scss
    |   |-- images
    |       |-- login-bg.jpg
    |       |-- logo-min.jpg
    |       |-- logo.jpg
    |       |-- project.png
    |-- components // 项目组件
    |  
    |-- layouts  // layouts
    |   |-- blank.vue
    |   |-- default.less
    |   |-- default.vue
    |-- libs  // js代码库
    |   |-- util.js
    |-- middleware // nuxt中间件
    |   |-- README.md
    |-- pages // 项目页面
    |  
    |-- plugins // 外部插件配置
    |   |-- README.md
    |   |-- fetch
    |   |   |-- index.js
    |   |-- iview
    |       |-- index.js
    |       |-- index.less
    |-- server // 服务器代码
    |   |-- index.js // 主入口
    |   |-- controller // 业务代码
    |   |-- lib // 库函数
    |   |   |-- index.js
    |   |-- sql // 数据库查询目录
    |   |-- static // 服务器静态件
    |       |-- menu.json
    |-- static // 前端静态文件
    |   |-- favicon.ico
    |-- store // vuex
        |-- index.js
    |-- databaseScript  // 数据库建库脚本
        |-- index.js        
    |-- files_upload  // 服务器文件上传存储目录
        |-- index.js 

## ✨ Features 特性

- 参考Ant design + iview 内容设计风格。iview主体UI框架。
- 从零开始简单搭建前后端一体的轻量级项目
- 记录日常工作，导出表格等。（内容后续开发中）


### 前端部分

- 搭建项目，参考 [nuxt.js](https://zh.nuxtjs.org/)  node + express 服务器部分 
- 为了更加了解Nuxt特性，加入了 Less 和 Sass 项目中可以自由选择
- 引入了WebSocket，开发了一个简单的即时消息推送功能。由于介意兼容性问题，采用socket.io。参考 [socket.io](https://socket.io/)
- 接口交互，使用了fetch [whatwg-fetch](https://www.npmjs.com/package/whatwg-fetch)以及[nuxt.js推荐的fetch方法](https://zh.nuxtjs.org/api/pages-fetch/#fetch-%E6%96%B9%E6%B3%95)  

### 后端部分

- node + express 
- 数据存储 最新版 [mysql v8.0.13](https://dev.mysql.com/downloads/mysql/)
- 缓存策略 [express-session](https://www.npmjs.com/package/express-session) +
[express-mysql-session](https://www.npmjs.com/package/express-mysql-session)；
可能Redis是最佳且常用方案。因为mysql-session的方式也不影响我开发（轻量级），所以没有关注到
Redis.
- 文件上传采用 [formidable.js](https://www.npmjs.com/package/formidable)
- 同样采用 [socket.io](https://socket.io/) 与前端对接。
- 打包 [compression](https://www.npmjs.com/package/compression) 可以压缩除了图片以外的文件高达70%的体积。大大节省了流量的开销，缩短了页面渲染时间。


## 项目搭建

关于mysql的安装，windows 跟 mac 版本我都安装过，mac较为好安装，直接安装就可以，windows稍微麻烦一点。如果没有安装过的同学可能会遇到很多问题，
上网搜索最新版本安装方法有很多，出了问题解决不下去，大胆的卸载重新安装。至于链接工具，Navicat就可以。不想花钱需要一点手段，不做赘述。

假设以上都已经准备就绪，数据库建库脚本在databaseScipt文件夹中，全部执行完毕，就可以做后端开发了。

