// 添加用户
export function createUser(handler, params) {
  return handler.post('user', params)
}

// 得到指定的用户信息
export function getUser(handler, id) {
  return handler.get('user/' + id)
}

// 得到所有用户信息
export function getPagedUsers(handler, param) {
  return handler.get('user', { params: param })
}

// 修改用户信息
export function updateUser(handler, params) {
  return handler.put('user/' + params.id, params)
}

// 删除用户信息
export function deleteUser(handler, id) {
  return handler.delete('user/' + id)
}
