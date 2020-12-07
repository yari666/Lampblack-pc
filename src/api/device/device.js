// 添加设备
export function createDevice(handler, params) {
  return handler.post('device', params)
}

// 得到指定的设备信息
export function getDevice(handler, id) {
  return handler.get('device/' + id)
}

// 得到所有设备信息
export function getPagedDevices(handler, param) {
  return handler.get('device', { params: param })
}

// 修改设备信息
export function updateDevice(handler, params) {
  return handler.put('device/' + params.id, params)
}

// 删除设备信息
export function deleteDevice(handler, id) {
  return handler.delete('device/' + id)
}

// 得到所有的设备信息
export function getAllDevices(handler) {
  return handler.get('device/device')
}
