<template>
  <div class="order">
    <van-nav-bar title="我的订单" fixed left-arrow @click-left="$router.go(-1)" />
    <!-- 切换导航 -->
    <van-tabs v-model="activeName" @click="onClick">
      <van-tab name="all" title="全部"></van-tab>
      <van-tab name="payment" title="待支付"></van-tab>
      <van-tab name="delivery" title="待发货"></van-tab>
      <van-tab name="received" title="待收货"></van-tab>
      <van-tab name="comment" title="待评价"></van-tab>
    </van-tabs>

    <div v-if="orderList.length>0" class="content">
      <!-- 订单商品子组件 -->
      <OrderListItem v-for="(item, index) in orderList" :item="item" :key="index" @click="$router.push(`/orderDetail?orderId=${item.order_id}`)"/>

      <!-- 提示 -->
      <div class="hint">
        <span>亲，没有更多了</span>
      </div>
    </div>

    <!-- 空 显示 -->
    <div v-else class="empty-txt">
      <img src="../../assets/empty.png" alt="">
      <div class="txt">亲，暂无订单记录</div>
    </div>
  </div>
</template>

<script>
import { getOrderList, todoCountsOrder } from '@/api/order'
import OrderListItem from '@/components/OrderListItem.vue'
export default {
  name: 'MyOrderIndex',
  components: {
    OrderListItem
  },
  data () {
    return {
      page: 1, // 页码默认 1
      orderList: [], // 订单列表数据
      activeName: this.$route.query.dataType || 'all'
    }
  },
  created () {
    // 页面加载时，获取订单数据
    this.onClick()
    todoCountsOrder()
  },
  methods: {
    // tab 切换
    async onClick () {
      const { data: { list: { data } } } = await getOrderList(this.activeName, this.page)

      // 数据处理 -累加商品的数量
      data.forEach(item => {
        item.total_num = 0 // 商品数量
        item.goods.forEach(goods => {
          item.total_num += goods.total_num
        })
      })
      this.orderList = data
    }
  }

}
</script>

<style lang="less" scoped>
.order {
  background-color: #fafafa;
  padding-top: 46px;
  min-height: 100vh;
  .content {
    .hint {
      text-align: center;
      padding: 15px 0;
      font-size: 14px;
      color: grey;
    }
  }
  // 空样式
  .empty-txt {
    padding: 50px 25px;
    text-align: center;
    img {
      width: 140px;
    }
    .txt {
      font-size: 14px;
      color: grey;
      margin-top: 20px;
    }
  }
}

.van-tabs {
  position: sticky;
  top: 0;
}

</style>
