// 封装购物车 API 接口
import request from '@/utils/request'

// 购物车 -添加商品到购物车
export const addCart = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/add', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

// 购物车 -获取购物车列表
export const getCartList = () => {
  return request.get('/cart/list')
}

// 购物车 -修改购物车商品数量
export const updateCartNum = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/update', { goodsId, goodsNum, goodsSkuId })
}

// 购物车 -删除
export const deleteCart = (cartIds) => {
  return request.post('/cart/clear', { cartIds })
}

// 购物车 -数量
export const getCartTotalApi = () => {
  return request.get('/cart/total')
}
