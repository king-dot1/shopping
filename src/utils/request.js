// request 模块 axios 封装
import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'

const instance = axios.create({
  // 基地址
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api',
  // 请求的超时时长
  timeout: 5000
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 配置请求头
  config.headers.platform = 'H5'
  config.headers['Access-Token'] = store.getters.token

  // 打开 loading 效果
  Toast.loading({
    message: '加载中...',
    // 是否禁止背景点击
    forbidClick: true,
    // 展示时长，0：一直展示
    duration: 0
  })

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 优化一下返回值; axios会多包一层 data
  const res = response.data

  // 统一处理接口错误信息，不等于 200；抛出一个 promise 错误
  if (res.status !== 200) {
    Toast(res.message)
    return Promise.reject(res.message)
  }

  // 关闭 loading 效果
  Toast.clear()

  return res
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default instance
