// 添加实时数据
export function createRealData(handler, params) {
  return handler.post('realData', params)
}

// 得到指定的实时数据信息
export function getRealData(handler, id) {
  return handler.get('realData/' + id)
}

// 得到所有实时数据信息
export function getPagedRealDatas(handler, param) {
  return handler.get('realData', { params: param })
}

// 修改实时数据信息
export function updateRealData(handler, params) {
  return handler.put('realData/' + params.id, params)
}

// 删除实时数据信息
export function deleteRealData(handler, id) {
  return handler.delete('realData/' + id)
}
