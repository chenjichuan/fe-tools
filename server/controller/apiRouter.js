module.exports = {
  getMembers: '/api/getMembers',
  getGroup: '/api/getGroup',
  user: {
    login: '/api/login',
    logout: '/api/logout',
    getCurrentUser: '/api/getCurrentUser',
    updateUserInfo: '/api/updateUserInfo',
  },
  project: {
    getProject:  '/api/getProject',
    addProject:  '/api/addProject',
    delProject:  '/api/delProject',
    editProject:  '/api/editProject',
  },
  weekly: {
    getWeekly:  '/api/getWeekly',
    addWeekly:  '/api/addWeekly',
    delWeekly:  '/api/delWeekly',
    editWeekly:  '/api/editWeekly',
  }
}
