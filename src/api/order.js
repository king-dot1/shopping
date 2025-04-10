// 封装订单 API 接口
import request from '@/utils/request'

// 提交订单
export const submitOrder = (mode, obj) => {
  const { goodsId, goodsNum, goodsSkuId, remark, cartIds } = obj
  return request.post('/checkout/submit', {
    mode, // 购买方式，buyNow-立即购买 cart-购物车购买
    goodsId, // 商品id -立即购买需传
    goodsNum, // 商品数量 -立即购买需传
    goodsSkuId, // 商品SKU -立即购买需传
    remark, // 留言
    cartIds, // 购物车id（立即购买不需）
    delivery: '10', // 物流方式，默认10
    couponId: 0, // 优惠卷id，默认0
    isUsePoints: 0, // 是否使用积分 0-不使用，1-使用
    payType: 10 // 支付方式，10-余额支付
  })
}

// 获取 -订单结算
export const checkoutOrder = (mode, obj) => {
  const { goodsId, goodsNum, goodsSkuId, cartIds } = obj
  return request.get('/checkout/order', {
    params: {
      mode,
      goodsId,
      goodsNum,
      goodsSkuId,
      cartIds,
      delivery: '10', // 物流方式，默认10
      shopId: 0, // 自提门店ID，默认0
      couponId: 0, // 优惠券ID，默认0
      isUsePoints: 0 // 是否使用积分抵扣（1使用 0不使用）
    }
  })
}

// 获取 -我的-订单
export const getOrderList = (dataType, page) => {
  return request.get('/order/list', {
    params: {
      dataType,
      page
    }
  })
}

// 获取 -我的-订单详情
export const getOrderDetail = (orderId) => {
  return request.get('/order/detail', {
    params: {
      orderId // 订单ID
    }
  })
}

// 取消 -我的-订单取消
export const cancelOrder = (orderId) => {
  return request.post('/order/cancel', { orderId })
}

// 支付 -我的-订单支付
export const payOrder = (orderId, payType) => {
  return request.post('/order/pay', {
    params: {
      orderId,
      payType
    }
  })
}

// 收货 -我的-订单确认收货
export const receiptOrder = (orderId) => {
  return request.post('/order/receipt', { orderId })
}

// 订单状态
// delivery：待收货，payment：待支付，received：待收货，refund：退款中
// 我的 -商品状态数量
export const todoCountsOrder = () => {
  return request.get('/order/todoCounts')
}
