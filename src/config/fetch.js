import request from './axios'

/**
 * 封装put请求
 * @param {*} url  接口地址
 * @param {*} params 参数
 * @returns {Promise}
 */
export function put(url, params = {}) {
  return request({
    url: url,
    method: 'put',
    data: params
  })
}

/**
 * 封装post请求
 * @param url  接口地址
 * @param params 参数
 * @returns {Promise}
 */
export function post(url, params = {}) {
  return request({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 封装delete请求
 * @param url  接口地址
 * @param params 参数
 * @returns {Promise}
 */
export function del(url, params = {}) {
  return request({
    url: url,
    method: 'delete',
    data: params
  })
}

/**
 * 封装get请求
 * @param url  接口地址
 * @param params 参数
 * @returns {Promise}
 */
export function get(url, params = {}) {
  return request({
    url: url,
    method: 'get',
    data: params
  })
}
