<template>
  <div class="pay">
    <!-- 顶部返回导航 -->
    <van-nav-bar title="订单结算台" fixed left-arrow @click-left="$router.go(-1)" />
    <!-- 内容部分 -->
    <div v-if="orderList.goodsList" class="content">
      <!-- 地址 -->
      <div @click="$router.push('/address?from=checkout')" class="address">
        <div class="icon-left">
          <van-icon name="location-o" />
        </div>
        <div class="title">
          <div class="txt" v-if="orderList.address !== null">
            <div class="txt-name-phone">
              <span class="name">{{ orderList.address.name }}</span>
              <span class="phone">{{ orderList.address.phone }}</span>
            </div>
            <!-- 街道 -->
            <div class="txt-place">
              {{ orderList.address.region.province + orderList.address.region.city + orderList.address.region.region
                +
                orderList.address.detail }}
            </div>
          </div>
          <!-- 空时显示 -->
          <div v-else class="tips">请选择配送地址</div>
        </div>
        <div class="icon-right">
          <van-icon name="arrow" />
        </div>
      </div>

      <!-- 订单明细 -->
      <div class="pay-list">
        <!-- 商品 -->
        <div class="goods-item" v-for="(item, index) in orderList.goodsList" :key="index">
          <div class="left">
            <img :src="item.goods_image" alt="">
          </div>
          <div class="right">
            <p class="text-ellipsis-2">{{ item.goods_name }}</p>
            <p class="info">
              <span>x{{ item.total_num }}</span>
              <span class="price red">￥{{ item.goods_price }}</span>
            </p>
          </div>
        </div>
        <!-- 合计 -->
        <div class="goods-total">
          <span>共 {{ orderList.orderTotalNum }} 件商品，合计：</span>
          <span class="total red">￥{{ orderList.orderTotalPrice }}</span>
        </div>

        <!-- 价格明细 -->
        <div class="pay-detail">
          <!-- 总金额 -->
          <div class="sum-money">
            <span>订单总金额：</span>
            <span class="red">￥{{ orderList.orderPrice }}</span>
          </div>
          <!-- 优惠卷 -->
          <div class="roll">
            <span>优惠卷：</span>
            <span>无优惠卷可用</span>
          </div>
          <!-- 配送运费 -->
          <div class="freight">
            <span>配送运费：</span>
            <span class="red">+￥0.00</span>
          </div>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="pay-way">
        <div class="title">支付方式</div>
        <div class="balance">
          <span>
            <van-icon name="balance-o" />
            余额支付（可用 ¥ {{ personal.balance }} 元）
          </span>
          <van-icon class="red" name="passed" />
        </div>
      </div>
      <!-- 卖家留言 -->
      <div class="message">
        <textarea v-model="remark" placeholder="选填：买家留言（50字内）">
        </textarea>
      </div>

      <!-- 提交订单按钮 -->
      <div class="floor-fixed">
        <div class="txt">
          实付款：
          <span class="red">￥{{ orderList.orderPayPrice }}</span>
        </div>
        <div class="bnt-order" @click="submit">提交订单</div>
      </div>
    </div>
  </div>
</template>

<script>
import { checkoutOrder, submitOrder } from '@/api/order'
export default {
  name: 'PayIndex',
  data () {
    return {
      orderList: {}, // 商品列数据
      personal: {}, // 用户信息
      remark: '' // 卖家留言
    }
  },
  created () {
    this.getCheckoutOrder()
  },

  methods: {
    // 获取订单数据
    async getCheckoutOrder () {
      let obj = {
        goodsId: this.goodsId,
        goodsNum: this.goodsNum,
        goodsSkuId: this.goodsSkuId
      }
      if (this.mode === 'cart') {
        obj = {
          cartIds: this.$route.query.cartIds,
          remark: this.remark
        }
      }

      const res = await checkoutOrder(this.mode, obj)
      const { data: { order, personal } } = res
      this.personal = personal || {}
      this.orderList = order || {}
    },

    // 提交订单
    async submit () {
      let obj = {
        goodsId: this.goodsId,
        goodsNum: this.goodsNum,
        goodsSkuId: this.goodsSkuId,
        remark: this.remark
      }
      if (this.mode === 'cart') {
        obj = {
          cartIds: this.$route.query.cartIds,
          remark: this.remark
        }
      }
      try {
        await submitOrder(this.mode, obj)
          .then(res => {
            // 提交订单成功后 -购物车数量发生变化
            if (this.mode === 'cart') {
              const total = +this.$store.state.cart.cartTotal - +this.orderList.orderTotalNum
              this.$store.commit('cart/setCartTotalMutations', total)
            }
            this.$toast.success('提交成功')
            this.$router.push('/myorder')
          })
      } catch (error) {
        this.$toast.fail('提交失败')
        console.error(error)
      }
    }
  },

  // 计算属性
  computed: {
    // 购买方式
    mode () {
      return this.$route.query.mode
    },
    // 商品id
    goodsId () {
      return this.$route.query.goodsId
    },
    // 商品数量
    goodsNum () {
      return this.$route.query.goodsNum
    },
    // 商品sku id
    goodsSkuId () {
      return this.$route.query.goodsSkuId
    }

  }
}
</script>

<style lang="less" scoped>
.pay {
  font-size: 14px;
  color: #333;
  padding: 50px 0;
  // 地址
  .address {
    display: flex;
    padding: 20px;
    background: url('../../assets/border-line.png') bottom repeat-x;
    background-size: 60px auto;
    align-items: center;
    .icon-left {
      // display: flex;
      font-size: 18px;
    }
    .title {
      flex: 1;
      padding: 0 10px;
      // 提示选地址
      .tips {
        color: #666;
      }
      // 地址内容
      .txt {
        color: #777;
        .txt-name-phone {
          display: flex;
          align-items: flex-start;
          margin-bottom: 3px;
          color: #303133;
          // 手机
          .phone {
            margin-left: 6px;
          }
          // 名字
          .name {
            font-size: 16px;
          }
        }
      }
    }
    .icon-right {
      // display: flex;
      color: #666;
    }
  }

  // 订单明细
  .pay-list {
    // 商品
    .goods-item {
      display: flex;
      padding: 10px;
      margin-bottom: 6px;
      .left {
        width: 80px;
        height: 80px;
        margin: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .right {
        flex: 1;
        padding: 10px;
        .info {
          display: flex;
          justify-content: space-between;
          align-content: center;
          margin-top: 5px;
        }
      }
    }
    // 合计
    .goods-total {
      display: flex;
      justify-content: flex-end;
      padding: 10px;
      color: #000;
      border-bottom: 1px solid #efefef;
    }
    // 价格明细
    .pay-detail {
      padding: 10px;
      border-bottom: 1px solid #efefef;
      // 优惠卷\配送运费
      .sum-money,.roll,.freight {
        display: flex;
        justify-content: space-between;
        padding-bottom: 10px;
      }
    }
  }

  // 支付方式
  .pay-way {
    padding: 10px;
    border-bottom: 1px solid #efefef;
    .balance {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      .van-icon-balance-o,.van-icon-passed {
        font-size: 20px;
      }
    }
  }

  // 卖家留言
  .message {
    padding: 10px;
    textarea {
      width: 100%;
      height: 100px;
      border: 0;
    }
  }

  // 提交订单按钮
  .floor-fixed {
    z-index: 999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 45px;
    border-top: 1px solid #efefef;
    background-color: #fff;
    .bnt-order {
      width: 120px;
      height: 100%;
      text-align: center;
      line-height: 45px;
      color: #fff;
      background:linear-gradient(90deg,#f9211c,
        #ff6335)
    }
  }
}

// 红色
.red {
  color: #fa2209;
}
</style>
