<template>
  <div v-if="cartTotal>0" class="cart">
    <!-- 顶部标题 -->
    <van-nav-bar fixed title="购物车" />

    <!-- 编辑切换 -->
    <div class="cart-title">
      <span class="all">共<i>{{ cartTotal }}</i>件商品</span>
      <div @click="edit">
        <span v-if="isEdit" class="edit"><van-icon name="edit" /> 编辑</span>
        <span v-else class="finish ">完成</span>
      </div>
    </div>

    <!-- 商品列 -->
    <div class="cart-list">
      <div v-for="(item, index) in getData" :key="index" class="cart-item">
        <!-- 复选框 -->
        <div class="checkbox">
          <van-checkbox @click="setChecked(item.id)" :value="item.isCheck"></van-checkbox>
        </div>
        <!-- 图片 -->
        <div class="show">
          <img :src="item.goods.goods_image" alt="">
        </div>
        <!-- 描述 -->
        <div class="info">
          <span class="tit text-ellipsis-2">
            {{ item.goods.goods_name }}
          </span>
          <span class="bottom">
            <!-- 价格 price-->
            <div class="price">￥<span>{{ item.goods.goods_price_min }}</span>
            </div>
            <!-- 数值框组件 -->
            <NumberBox :value="item.goods_num" @input="(value, oldValue) => changeNum(item.goods_id, value, item.goods_sku_id, oldValue)">
            </NumberBox>
          </span>
        </div>
      </div>
    </div>

    <!-- 结算按钮 -->
    <div class="floor">
      <div class="all-check">
        <van-checkbox @click="checkAll" :value="cartCheckedAll">全选</van-checkbox>
      </div>
      <div class="all-total">
        <div class="price">
          <span>合计：</span>￥
          <i class="total-price">{{ cartCheckedPrice.toFixed(2) }}</i>
        </div>
        <div @click="payCart" v-if="isEdit" class="goPay" :class="{ disabled: cartCheckedTotal === 0 }">
          结算({{ cartCheckedTotal }})
        </div>
        <div @click="del" v-else class="del" :class="{ disabled: cartCheckedTotal === 0 }">
          删除({{ cartCheckedTotal }})
        </div>
      </div>
    </div>
  </div>

  <div v-else class="cart-empty">
    <img class="img" src="../../assets/empty.png" alt="">
    <div class="txt">您的购物车是空的, 快去逛逛吧</div>
    <div @click="$router.push('/')" class="btn">去逛逛</div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import NumberBox from '@/components/NumberBox.vue'
export default {
  name: 'CartPage',
  components: {
    NumberBox
  },
  data () {
    return {
      isEdit: true // 是否编辑状态
    }
  },
  created () {
    // 判断 token 是否存在
    if (this.token) {
      this.getCartList()
    }
  },
  methods: {
    // 获取数据
    getCartList () {
      this.$store.dispatch('cart/getCartDataAction')
    },
    // 全选
    checkAll () {
      this.setCheckedAll(!this.cartCheckedAll)
    },
    // 修改商品数量
    changeNum (goodsId, goodsNum, goodsSkuId, oldValue) {
      // 节流
      let timer = null
      timer = setTimeout(() => {
        this.$store.dispatch('cart/updateCartNumAction', { goodsId, goodsNum, goodsSkuId, oldValue })
        clearTimeout(timer)
      }, 300)
    },
    // 编辑切换
    edit () {
      this.isEdit = !this.isEdit
    },
    // 删除
    async del () {
      if (this.cartCheckedTotal === 0) return
      this.$store.dispatch('cart/delCartAction')
      this.isEdit = true
    },
    // 结算
    payCart () {
      this.$router.push({
        path: '/pay',
        query: {
          mode: 'cart',
          cartIds: this.cartIds
        }
      })
    },
    ...mapMutations('cart', ['setChecked', 'setCheckedAll'])
  },
  computed: {
    getData () {
      return this.$store.state.cart.cartList
    },
    token () {
      return this.$store.getters.token
    },
    ...mapGetters('cart', ['cartTotal', 'cartCheckedTotal', 'cartCheckedPrice', 'cartCheckedAll', 'cartIds'])
  },
  watch: {
    // 监听isEdit 实现购物车数据的状态跟着 更新
    isEdit () {
      this.setCheckedAll(this.isEdit)
    }
  }

}
</script>

<style lang="less" scoped>
// 购物车
.cart {
  padding-top: 46px;
  padding-bottom: 100px;
  background-color: #f5f5f5;
  min-height: 100vh;
  .cart-title {
    height: 40px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    .all {
      i {
        font-style: normal;
        color: #fa2209;
        font-size: 16px;
        margin: 0 2px;
      }
    }
    // 编辑
    .edit {
      .van-icon-edit {
        font-size: 18px;
      }
    }
    // 完成
    .finish {
      color: #cb1c08;
    }
  }
  // 商品列
  .cart-list {
    .cart-item {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      margin: 10px;
      margin-top: 0;
      background-color: #fff;
      border-radius: 5px;
      // 复选框
      .checkbox {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      // 图片
      .show {
        img {
          width: 100px;
          height: 100px;
        }
      }
      // 描述
      .info {
        width: 210px;
        padding: 10px 5px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        .bottom {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          .price {
            font-size: 12px;
            color: #fa2209;
            span{
              font-size: 16px;
            }
          }
        }
      }
    }
  }

  // 底部按钮
  .floor {
    position: fixed;
    bottom: 50px;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    .all-check {
     ::v-deep .van-checkbox__label {
        font-size: 16px;
      }
    }
    .all-total {
      display: flex;
      line-height: 36px;
      .price {
        font-size: 14px;
        margin-right: 10px;
        .total-price {
          font-size: 18px;
          font-style: normal;
          color: #fa2209;
        }
      }
      // 按钮
      .goPay, .del {
        height: 36px;
        width: 100px;
        line-height: 36px;
        text-align: center;
        font-style: 18px;
        background-color: #fa2f21;
        color: #fff;
        border-radius: 20px;
        &.disabled {
          background-color: #ff9779;
        }
      }
    }
  }
}

// 购物车 -空
.cart-empty {
  padding: 80px 30px;
  text-align: center;
  font-size: 16px;
  .img {
    margin: 0 auto;
    width: 140px;
    display: block;
  }
  .txt {
    margin: 30px;
    color: #666;
  }
  .btn {
    margin: 0 auto;
    width: 110px;
    height: 32px;
    line-height: 32px;
    background-color: #fa2c20;
    color: #fff;
    border-radius: 16px;
  }
}
</style>
