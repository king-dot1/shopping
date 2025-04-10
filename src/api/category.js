// 分类页 API 接口封装

import request from '@/utils/request'

// 获取 -商品全部分类
export const getAllCategory = () => {
  return request.get('/category/list')
}
