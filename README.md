# 前端应用工具

> My riveting Nuxt.js project

# view in  [example](http://47.99.215.225)


## Build Setup

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
