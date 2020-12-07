import axios from 'axios'
import { baseUrl } from './env'

// 创建axios实例
const service = axios.create({
  // 配置后台api根路径
  baseURL: baseUrl,
  timeout: 5000 // 请求超时时间
})

// 生成环境跨域处理
if (process.env.NODE_ENV !== 'development') {
  service.withCredentials = true
}

// 挂在请求配置
service.interceptors.request.use(config => {
  console.log(config)

  config.headers.Authorization =
    'Bearer ' + window.sessionStorage.getItem('token')
  // 在最好必须返回config
  return config
})

export default service
