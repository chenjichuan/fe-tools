import { getMenuList, updateUserInfo } from '../api'
import {
  getHomeRoute,
  getBreadCrumbList,
} from '@/libs/util'
/** 区别于传统模式下的模块模式 **/
export const state = () => ({
  app: {
    menuList:[],
    breadCrumbList: [],
    homeRoute: {},
  },
  authUser: {}
})
export const getters = {
}
export const mutations = {
  SET_USER(state, authUser) {
    state.authUser = authUser
  },
  SET_MENU(state, list) {
    state.app.menuList = list
  },
  setHomeRoute (state, menuList) {
    state.app.homeRoute = getHomeRoute(menuList, 'home')
  },
  setBreadCrumb (state, route) {
    state.app.breadCrumbList = getBreadCrumbList(state.app.menuList, state.app.homeRoute, route)
  },
  // 修改用户信息
  resetUserInfo(state, params) {
    state.authUser = {...state.authUser, ...params}
  },
}
export const actions = {
  // 用户信息
  nuxtServerInit ({ commit }, { req, redirect }) {
    try {
      if (req.session && req.session.authUser) {
        commit('SET_USER', req.session.authUser)
      } else {
        redirect('/login')
      }
    } catch {}

  },
  // 登录
  login ({ commit }, { username, password }) {
   return new Promise((resolve, reject) => {
      $fetch.post('/api/login', { username, password })
        .then(({data}) => {
          commit('SET_USER', data)
          resolve()
        }, (res) => {
          reject(res)
        })
    })
  },
  // 登出
  logout ({ commit }) {
    return new Promise((resolve) => {
      $fetch.post('/api/logout')
        .then(() => {
          commit('SET_USER', {})
          resolve()
        })
    })
  },

  getMenuList({ commit }) {
    return getMenuList().then((res) => {
      commit('SET_MENU', res.data.list)
    })
  }
}


