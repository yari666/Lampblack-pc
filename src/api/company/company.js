// 添加公司/企业
export function createCompany(handler, params) {
  return handler.post('company', params)
}

// 得到指定的公司/企业信息
export function getCompany(handler, id) {
  return handler.get('company/' + id)
}

// 得到所有公司/企业信息
export function getPagedCompanys(handler, param) {
  return handler.get('company', { params: param })
}

// 修改公司/企业信息
export function updateCompany(handler, params) {
  return handler.put('company/' + params.id, params)
}

// 删除公司/企业信息
export function deleteCompany(handler, id) {
  return handler.delete('company/' + id)
}

// 得到所有的公司/企业信息
export function getAllCompanies(handler) {
  return handler.get('company/company')
}
