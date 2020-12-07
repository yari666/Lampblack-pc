// 添加节点
export function createNode(handler, params) {
  return handler.post('node', params)
}

// 得到指定的节点信息
export function getNode(handler, id) {
  return handler.get('node/' + id)
}

// 得到所有节点信息
export function getPagedNodes(handler, param) {
  return handler.get('node', { params: param })
}

// 修改节点信息
export function updateNode(handler, params) {
  return handler.put('node/' + params.id, params)
}

// 删除节点信息
export function deleteNode(handler, id) {
  return handler.delete('node/' + id)
}
