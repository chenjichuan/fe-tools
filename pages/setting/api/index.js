export const getCurrentUser = (data) => $fetch.get('/api/getCurrentUser', data)
export const updateUserInfo = (data) => $fetch.post('/api/updateUserInfo', data)
