import { cancelOrder, payOrder, receiptOrder } from '@/api/order'
export default {
  methods: {
    orderConfirm (item) {
      let msg = ''
      // 需要判断是 立刻付款、取消订单、确认收货
      if (item.state_text === '待发货') {
        // 取消订单
        msg = '您确定要取消该订单吗？'
      } else if (item.state_text === '待收货') {
        // 确认收货
        msg = '您确定要确认收货吗？'
      } else if (item.state_text === '待支付') {
        // 立刻付款
        msg = '您确定要支付订单吗？'
      }
      this.$dialog.confirm({
        title: '温馨提示',
        message: msg,
        confirmButtonText: '确定',
        confirmButtonColor: '#007aff',
        cancelButtonText: '取消'
      }).then(async () => {
        // 点击确定 发起请求
        if (item.state_text === '待发货') {
          // 取消订单
          const res = await cancelOrder(item.order_id)
          console.log(res)
        } else if (item.state_text === '待收货') {
          // 确认收货
          const res = await receiptOrder(item.order_id, this.payType)
          console.log(res)
        } else if (item.state_text === '待支付') {
          // 立刻付款
          const res = await payOrder(item.order_id)
          console.log(res)
        }

        // 刷新页面
        location.reload()
      }).catch(() => {
      // 点击取消 不做任何处理
      })
    }
  }
}
