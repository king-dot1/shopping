// 封装首页 API 接口

import request from '@/utils/request'

// 首页 -获取首页数据
export const getHomeData = () => {
  return request('/page/detail')
}
