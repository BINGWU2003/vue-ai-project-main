import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { getToken, removeToken } from '../utils/auth'
import type { ApiResponse } from '../types'

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: '/api', // 开发阶段使用相对路径
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除本地存储并重定向到登录页
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
