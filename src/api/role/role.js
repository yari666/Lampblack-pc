// 添加角色
export function createRole(handler, params) {
  return handler.post('role', params)
}

// 得到指定的角色信息
export function getRole(handler, id) {
  return handler.get('role/' + id)
}

// 得到所有角色信息
export function getPagedRoles(handler, param) {
  return handler.get('role', { params: param })
}

// 修改角色信息
export function updateRole(handler, params) {
  return handler.put('role/' + params.id, params)
}

// 删除角色信息
export function deleteRole(handler, id) {
  return handler.delete('role/' + id)
}

// 得到角色下拉信息
export function getRoleDropdown(handler) {
  return handler.get('role/role')
}
