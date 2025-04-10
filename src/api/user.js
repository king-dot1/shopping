// 个人中心 -我的 API 接口封装
import request from '@/utils/request'

// 我的-获取用户信息
export const getUserInfo = () => {
  return request.get('/user/info')
}

// 我的 -余额，积分，优惠券
export const getUserAssets = () => {
  return request.get('/user/assets')
}
