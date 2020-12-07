/**
 * 得到左侧菜单列表
 * @param {*} handler
 * @param {*} params
 */
export default function getMenuList(handler, params) {
  return handler.get('menu/menuList/' + params)
}
// 添加菜单
export function createMenu(handler, params) {
  return handler.post('menu', params)
}

// 得到指定的菜单信息
export function getMenu(handler, id) {
  return handler.get('menu/' + id)
}

// 得到所有菜单信息
export function getPagedMenus(handler, param) {
  return handler.get('menu', { params: param })
}

// 修改菜单信息
export function updateMenu(handler, params) {
  return handler.put('menu/' + params.id, params)
}

// 删除菜单信息
export function deleteMenu(handler, id) {
  return handler.delete('menu/' + id)
}

// 得到菜单下拉信息
export function getMenuDropdown(handler) {
  return handler.get('menu/parentMenu')
}
