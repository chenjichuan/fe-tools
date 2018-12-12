/**
 *
 * fetch 插件挂载到window上，属于非ssr插件，客户端调用
 *
 * **/
import qs from 'qs';
import Vue from 'vue'
require('whatwg-fetch')
require('es6-promise') // 兼容老版本浏览器同fetch

const doFetch = ({url, method, params, resolve, reject}) => {
  fetch(url, {
    // 发送客户端 cookies 到服务端
    credentials: 'same-origin',
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: params
  }).then((res) => {
    if (res.status !== 200) {
      reject('Bad credentials')
      throw new Error('Bad credentials')
    } else {
      return res.json()
    }
  })
    .then((data) => {
      if(data.code === 0) {
        resolve(data)
      } else {
        if(data.code === -2) {
          new Vue().$Notice.error({
            title: '登录失效',
            desc: data.message + ',请重新登陆',
          });
          let timer = setTimeout(() => {
            clearTimeout(timer);
            location.href = '/login'
          }, 2000)
        }
        reject(data)
        // throw new Error(data.error)
      }
    })
}

const middle = (type, url, data) => {
  const method = type.toUpperCase()
  const p = new Promise((resolve, reject) => {
    let params = ''
    if(method === 'POST') {
      params = JSON.stringify(data)
    } else {
      params = qs.stringify(data)
      params ? url += `?${params}` : url += ''
      params = null
    }

    doFetch({url, method, params, resolve, reject})
  })
  return p
}

const $fetch = {
  get(url, data) {
    return middle('get', url, data)
  },
  post(url, data) {
    return middle('post', url, data)
  },
}
window.$fetch = $fetch

