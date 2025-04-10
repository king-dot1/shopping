<template>
  <div class="user">
    <!-- 头部 -->
    <div class="my-head">
      <!-- 头像 -->
      <div class="avatar">
        <img v-if="!userInfo.avatar" src="../../assets/default-avatar.png" alt="">
        <img v-else :src="userInfo.avatar" alt="">
      </div>
      <!-- 用户信息 -->
      <div class="info">
        <div class="phone">{{ userInfo.mobile||'未登录' }}</div>
        <div v-if="userInfo.user_id" class="vip">
            <van-icon name="diamond-o" />
            普通会员
        </div>
        <div @click="$router.push('/login')" v-else>点击登录账号</div>
      </div>
    </div>

    <!-- 财产 -->
    <div class="my-asset">
      <!-- 余额 -->
      <div class="left">
        <div>
          <span class="red-17">{{ assets.balance || 0 }}</span>
          <span class="top-7">账户余额</span>
        </div>
        <div>
          <span class="red-17">{{ assets.points || 0 }}</span>
          <span class="top-7">积分</span>
        </div>
        <div>
          <span class="red-17">{{ assets.coupon || 0 }}</span>
          <span class="top-7">优惠卷</span>
        </div>
      </div>
      <!-- 我的钱包 -->
      <div class="right">
        <van-icon name="pending-payment" />
        <span class="top-7">我的钱包</span>
      </div>
    </div>

    <!-- 订单导航 -->
    <div class="my-order-nav">
      <div @click="$router.push(`/myorder?dataType=all`)">
        <van-icon class="item-icon" name="description-o" />
        <span>全部订单</span>
      </div>
      <div @click="$router.push(`/myorder?dataType=payment`)">
        <van-icon class="item-icon" name="clock-o" />
        <span>待支付</span>
        <span v-if="counts.payment>0" class="item-badge">{{ counts.payment }}</span>
      </div>
      <div @click="$router.push(`/myorder?dataType=delivery`)">
        <van-icon class="item-icon" name="logistics" />
        <span>待发货</span>
        <span v-if="counts.delivery >0" class="item-badge">{{ counts.delivery }}</span>
      </div>
      <div @click="$router.push(`/myorder?dataType=received`)">
        <van-icon class="item-icon" name="sign" />
        <span>待收货</span>
        <span v-if="counts.received > 0" class="item-badge">{{ counts.received }}</span>
      </div>
    </div>

    <!-- 我的服务 -->
    <div class="my-service">
      <div class="title">
        我的服务
      </div>
      <div class="content">
        <div @click="$router.push('/address')">
          <van-icon class="item-icon" name="location-o" />
          <span>收货地址</span>
        </div>
        <div>
          <van-icon class="item-icon" name="point-gift-o" />
          <span>领卷中心</span>
        </div>
        <div>
          <van-icon class="item-icon" name="balance-list-o" />
          <span>优惠卷</span>
        </div>
        <div>
          <van-icon class="item-icon" name="question-o" />
          <span>我的帮助</span>
        </div>
        <div>
          <van-icon class="item-icon" name="miniprogram-o" />
          <span>我的积分</span>
        </div>
        <div>
          <van-icon class="item-icon" name="after-sale" />
          <span>退换/售后</span>
        </div>
      </div>
    </div>

    <!-- 退出登录按钮 -->
    <div v-if="this.loginStatus" @click="logout" class="login-bnt">退出登录</div>

  </div>
</template>

<script>
import { todoCountsOrder } from '@/api/order'
import { getUserInfo, getUserAssets } from '@/api/user'

export default {
  name: 'UserPage',
  data () {
    return {
      userInfo: {},
      counts: {}, // 全部/待支付/待收货/待发货 数量
      assets: {}
    }
  },
  created () {
    // 判断是否有 token
    if (this.loginStatus) {
      this.getUserInfo()
    }
  },
  computed: {
    // 登录状态
    loginStatus () {
      return this.$store.getters.token
    }
  },
  methods: {
    async getUserInfo () {
      // 获取用户信息
      const { data: { userInfo } } = await getUserInfo()
      this.userInfo = userInfo
      // 获取商品状态数量
      const { data: { counts } } = await todoCountsOrder()
      this.counts = counts
      // 获取余额、积分、优惠卷
      const { data: { assets } } = await getUserAssets()
      this.assets = assets
    },
    // 退出登录
    logout () {
      // 清除用户信息
      this.$dialog.confirm({
        title: '温馨提示',
        message: '是否退出登录？'
      }).then(() => {
        this.$store.dispatch('user/logout')
      }).catch(() => { })
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  background-color: #fafafa;
  min-height: 100vh;
  // 头部
  .my-head {
    height: 130px;
    background: url("https://smart-shop.itheima.net/static/background/user-header2.png");
    background-size: cover;
    display: flex;
    align-items: center;
    padding-left: 15px;
    // 头像
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    // 用户信息
    .info {
      display: flex;
      flex-direction: column;
      margin-left: 15px;
      color: rgb(197, 154, 70);
      font-size: 15px;
      .phone {
        font-size: 17px;
        font-weight: 700;
        margin-bottom: 7px;
      }
      .vip {
        font-size: 14px;
        padding: 3px 5px;
        background-color: #3c3c3c;
        border-radius: 8px;
        color: #e0d3b6;
        .van-icon {
          color: #ffb632;
          font-weight: 700;
        }
      }
    }
  }
  // 财产
  .my-asset {
    display: flex;
    background-color: #fff;
    padding: 20px 0;
    .left {
      flex: 1;
      display: flex;
      font-size: 14px;
      color: #666;
      div {
        display: flex;
        flex-direction: column;
        text-align: center;
        padding: 0 21px;
      }
    }
    .right {
      width: 100px;
      display: flex;
      flex-direction: column;
      text-align: center;
      font-size: 14px;
      color: #666;
      border-left: 1px solid #eee;
      .van-icon {
        font-size: 22px;
        color: #545454;
      }
    }
  }
  // 订单导航
  .my-order-nav {
    display: flex;
    flex-wrap: wrap;
    width: 94%;
    background-color: #fff;
    margin: 10px auto;
    padding: 10px 0;
    border-radius: 4px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
    div {
      width: 25%;
      display: flex;
      flex-direction: column;
      text-align: center;
      font-size: 14px;
      color: #666;
      position: relative;
      .item-icon {
        font-size: 22px;
        color: #545454;
        padding: 5px 0;
      }
      .item-badge {
        position: absolute;
        top: 0;
        left: 48px;
        padding:0 5px;
        border-radius: 50%;
        color: #fff;
        background-color: #fa2209;

      }
    }
  }
  // 我的服务
  .my-service {
    width: 94%;
    background-color: #fff;
    margin: 10px auto;
    padding: 10px 0;
    border-radius: 4px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
    .title {
      padding-left: 12px;
      margin-bottom: 10px;
      font-size: 16px;
      color: #303133;
    }
    .content {
      display: flex;
      // 允许换行
      flex-wrap: wrap;
      div {
        // 设置元素宽度为 25%
        width: 25%;
        display: flex;
        flex-direction: column;
        text-align: center;
        font-size: 14px;
        color: #666;
        margin-bottom: 15px;
        .item-icon {
          font-size: 22px;
          color: #ff3800;
          padding: 5px 0;
        }
      }
    }

  }
  // 退出登录按钮
  .login-bnt {
    width: 60%;
    padding: 8px 0;
    margin: 20px auto 0 auto ;
    border: 1px solid #dcdcdc;
    font-size: 14px;
    color: #616161;
    text-align: center;
    border-radius: 10px;
  }
}

.red-17 {
  color: red;
  font-size: 17px;
}
.top-7 {
  margin-top: 7px;
}
</style>
