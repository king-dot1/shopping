<template>
  <div class="order-detail">
    <van-nav-bar title="订单详情" fixed left-arrow @click-left="$router.go(-1)" />
    <!-- 内容 / 容器-->
    <div class="container" v-if="detailList.order_id">
      <!-- 头部 -->
      <div class="header">
        <div class="order-state">
          <div class="image">
            <img src="../../assets/wait_deliver.png" alt="">
          </div>
          <div class="state">
            <span>{{ detailList.state_text }}</span>
          </div>
        </div>
      </div>

      <!-- 地址 -->
      <div class="address">
        <p class="top">{{ detailList.address.name }} {{ detailList.address.phone }}</p>
        <p class="bottom">{{ detailList.address.region.province }}{{ detailList.address.region.city }}{{
          detailList.address.region.region }} {{ detailList.address.detail }}</p>
      </div>

      <!-- 商品列 -->
      <div class="list">
        <div class="list-item" v-for="(good, index) in detailList.goods" :key="index"
          @click="$router.push(`/detail/${good.goods_id}`)">
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

      <!-- 订单号 -->
      <div class="order-number">
        <!-- 编号 -->
        <p class="number">订单编号<span>{{ detailList.order_no }}</span></p>
        <p class="time">下单时间<span>{{ detailList.create_time }}</span></p>
        <!-- 留言 -->
        <p class="remark">卖家留言<span>{{ detailList.buyer_remark||'--' }}</span></p>
      </div>

      <!-- 订单金额 -->
      <div class="order-money">
        <p>
          <span>订单金额</span>
          <span class="money">￥{{ detailList.total_price }}</span>
        </p>
        <!-- 运费 -->
        <p>
          <span>运费</span>
          <span class="freight">+￥{{ detailList.express_price }}</span>
        </p>
        <!-- 水平线 -->
        <div class="horizontal-line"></div>
        <!-- 实付款 -->
        <div class="payment">
          <span>
            实付款 <span class="red"> <span class="symbol"> ￥</span>{{detailList.total_price }}</span>
          </span>
        </div>
      </div>

      <!-- 底部固定 -->
      <div class="footer">
        <!-- 按钮 -->
        <div class="actives">
          <div @click="cancel">
            <div v-if="detailList.order_status === 10">
              <span v-if="detailList.pay_status === 10">立刻付款</span>
              <span v-else-if="detailList.delivery_status === 10">申请取消</span>
              <span v-else-if="detailList.delivery_status === 20 || detailList.delivery_status === 30">确认收货</span>
            </div>
            <div v-if="detailList.order_status === 30">
              <span>评价</span>
            </div>
          </div>

          <div class="cancel">
            <p v-if="detailList.state_text === '待取消'">取消申请中</p>
            <p v-if="detailList.state_text === '待支付'">待支付中</p>
            <p v-if="detailList.state_text === '待收货'">待收货中</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderDetail } from '@/api/order'
import orderConfirm from '@/mixins/orderConfirm'
export default {
  name: 'orderDetail',
  mixins: [orderConfirm], // 使用 mixins，使用混入方法
  data () {
    return {
      detailList: {}, // 订单详情数据
      payType: 10 // 支付方式，10：余额支付，20：微信支付
    }
  },
  created () {
    this.OrderDetail()
  },
  methods: {
    // 获取订单详情数据
    async OrderDetail () {
      const { data: { order } } = await getOrderDetail(this.$route.query.orderId)
      this.detailList = order
    },
    // 取消订单
    async cancel () {
      // 调用 mixins 中的方法，弹出确认框
      this.orderConfirm(this.detailList)
    }
  }
}
</script>

<style lang="less" scoped>
.order-detail {
  background: #f4f4f4;
  min-height: 100vh;
  padding: 46px 0 60px 0;
  ::v-deep .van-nav-bar {
    background: #e8c269;
    .van-nav-bar__title {
      color: #fff;
    }
    .van-nav-bar__arrow {
      color: #fff;
    }
    // 移除可能存在的伪元素
    &::after {
      display: none !important;
    }
  }
  // 内容 / 容器
  .container {
    // 头部
    .header {
      height: 140px;
      padding: 28px 15px;
      padding-bottom: 0;
      background-color: #e8c269;
      .order-state {
        display: flex;
        align-items: center;
        .image {
          width: 64px;
          height: 64px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .state {
          font-size: 19px;
          color: #fff;
          margin-left: 15px;
          font-weight: bold;
        }
      }

    }
    // 地址
    .address {
      padding: 12px;
      margin: -25px auto 10px auto;
      width: 94%;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
      .top {
        font-size: 14px;
        color: #333;
      }
      .bottom {
        margin-top: 6px;
        font-size: 12px;
        color: #999;
      }
    }
    // 商品列
    .list {
      padding: 12px;
      margin: 0 auto 10px auto;
      width: 94%;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
      font-size: 13px;
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
    // 订单号
    .order-number {
      padding: 12px;
      margin: 0 auto 10px auto;
      width: 94%;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
      font-size: 12px;
      color: #999;
      p {
        margin-bottom: 12px;
        span {
          margin-left: 15px;
          font-size: 13px;
          color: #333;
        }
      }
    }
    // 订单金额
    .order-money {
      padding: 12px;
      margin: 0 auto 10px auto;
      width: 94%;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
      font-size: 12px;
      color: #999;
      p {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        .money,.freight {
          color: #333;
          font-size: 13px;
        }
      }
      .horizontal-line {
        width: 100%;
        height: 1px;
        background-color: #f1f1f1;
        margin-bottom: 12px;
      }
      .payment {
        display: flex;
        justify-content: flex-end;
        font-size: 14px;
        color: #333;
        .symbol {
          font-size:12px;
          margin-right: -2px;
        }
      }

    }
  }

  // 底部按钮
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 999;
    background-color: #fff;
    box-shadow: 1px 1px 2px 0 rgba(0,0,0,.05);
    padding: 0 15px;
    // 按钮
    .actives {
      text-align: right;
      span {
        display: inline-block;
        padding: 5px 12px;
        border: 0.5px solid #a8a8a8;
        color: #383838;
        border-radius: 14px;
        font-size: 14px;
      }
      .cancel {
        color: #888;
        font-size: 14px;
        text-align: left;
     }
    }
  }
}

.red {
  color: #fa2209!important;
}
</style>
