<template>
  <div>
    <!-- 路由出口 -->
    <router-view></router-view>

    <!-- 底部导航栏 -->
    <van-tabbar active-color="#ee0a24" inactive-color="#000" route>
      <van-tabbar-item to="/home" icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/category" icon="apps-o">分类页</van-tabbar-item>
      <van-tabbar-item to="/cart" icon="shopping-cart-o">购物车</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
      <span v-if="tatol > 0" class="num">{{ tatol > 99 ?
        '99+' : tatol }}</span>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  data () {
    return {
    }
  },
  created () {
    this.getCartTotal()
  },
  methods: {
    // 判断token
    getCartTotal () {
      if (this.token) {
        // 设置 购物车商品个数量
        this.$store.dispatch('cart/setCartTotalActions')
      }
    }
  },
  computed: {
    token () {
      return this.$store.getters.token
    },
    // 购物车商品数量
    tatol () {
      return this.$store.state.cart.cartTotal
    }
  }

}
</script>

<style lang="less" scoped>
// 小图标
.num {
  z-index: 999;
  position: absolute;
  top: 2px;
  left: 238px;
  padding: 0 2px;
  min-width: 16px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  line-height: 16px;
  border-radius: 50%;
  background-color: #ee0a24;
}
</style>
