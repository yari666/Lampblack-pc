/**
 * 默认导出
 */
export default (handler, params) => {
  return handler.post('user/authrization', params)
}
