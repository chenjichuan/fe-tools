export const getProject = (data) => $fetch.get('/api/getProject', data)
export const addProject = (data) => $fetch.post('/api/addProject', data)
export const delProject = (data) => $fetch.post('/api/delProject', data)
export const editProject = (data) => $fetch.post('/api/editProject', data)
