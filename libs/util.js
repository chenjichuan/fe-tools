/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (menu, homeName = 'home') => {
  let i = -1
  let len = menu.length
  let homeRoute = {}
  while (++i < len) {
    let item = menu[i]
    if (item.name === homeName) homeRoute = item
  }
  return homeRoute
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (menuList, homeRoute, currentRoute) => {
  let homeItem = {...homeRoute}
  let obj = []
  menuList.forEach(item => {
    if (item.name === homeRoute.name) return
    if (item.children) {
      const [active] = item.children.filter(item => item.name === currentRoute.name)
      if (active) {
        obj = obj.concat([{
          icon: item.icon || '',
          name: item.name,
          valueText: item.valueText || '',
        }, {
          icon: active.icon || '',
          name: active.name,
          valueText: active.valueText,
          title: item.valueText + '-' + active.valueText,
        }])
      }
    } else {
      if (item.name === currentRoute.name) {
        obj.push({
          icon: item.icon || '',
          name: item.name,
          valueText: item.valueText || '',
          title: item.valueText
        })
      }
    }
  })
  return [{...homeItem, to: homeRoute.path}, ...obj]
}
