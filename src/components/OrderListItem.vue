<template>
  <div class="order-item">
    <!-- 时间 -->
    <div class="item-top">
      <div class="time"> {{ item.create_time }}</div>
      <div class="text">
        <span>{{ item.state_text }}</span>
      </div>
    </div>
    <!-- 商品列 -->
    <div @click="$emit('click')" class="list">
      <div class="list-item" v-for="(good, index) in item.goods" :key="index">
        <div class="goods-image">
          <img :src="good.goods_image" alt="">
        </div>
        <div class="goods-content">
          <span class="text-ellipsis-2">{{ good.goods_name }}</span>
        </div>
        <div class="goods-right">
          <span class="price">￥{{ good.goods_price }}</span>
          <span class="count">x {{ good.total_num }}</span>
        </div>
      </div>
    </div>

    <!-- 商品数量 -->
    <div class="total">
      <span>共{{ item.total_num }}件商品，总金额 ￥<span class="count-money">{{ item.total_price }}</span></span>
    </div>

    <!-- 按钮 -->
    <div class="actives">
      <div @click="onClick">
        <div v-if="item.order_status === 10">
          <span v-if="item.pay_status === 10">立刻付款</span>
          <span v-else-if="item.delivery_status === 10">申请取消</span>
          <span v-else-if="item.delivery_status === 20 || item.delivery_status === 30">确认收货</span>
        </div>
        <div v-if="item.order_status === 30">
          <span>评价</span>
        </div>
      </div>
      <div class="cancel">
        <p v-if="item.state_text === '待取消'">取消申请中</p>
        <p v-if="item.state_text ==='待支付'">待支付中</p>
        <p v-if="item.state_text === '待收货'">待收货中</p>
      </div>
    </div>
  </div>
</template>

<script>
import orderConfirm from '@/mixins/orderConfirm'
export default {
  name: 'OrderListItem',
  mixins: [orderConfirm],
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onClick () {
      this.orderConfirm(this.item)
    }
  }
}
</script>

<style lang="less" scoped>
.order-item {
  margin: 10px auto;
  padding: 15px;
  background-color: #fff;
  width: 94%;
  font-size: 13px;
  box-shadow: 0 1px 2px 0px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  color: #333;
  .item-top {
    color: #777;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .text {
      color: #fa2209;
    }
  }
  .list {
  // 商品列
  .list-item {
    display: flex;
    margin-bottom: 20px;
    .goods-image {
      width: 90px;
      height: 90px;
      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }

    .goods-content {
      flex: 2;
      padding: 8px 0 0 8px;
    }

    .goods-right {
      flex: 1;
      padding-top: 8px;
      display: flex;
      flex-direction: column;
      text-align: right;
      color: #999;

      .price {
        margin-bottom: 8px;
      }
    }
  }
  }

  .total {
    margin-bottom: 15px;
    text-align: right;
    .count-money {
      font-size: 14px;
    }
  }

  .actives {
    text-align: right;
    span {
      display: inline-block;
      padding: 3px 10px;
      border: 0.5px solid #a8a8a8;
      color: #383838;
      border-radius: 5px;
      font-size: 14px;
    }
    .cancel {
      color: #888;
      font-size: 14px;
      text-align: left;
    }
  }

}
</style>
