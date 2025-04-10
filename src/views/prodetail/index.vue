<template>
  <div class="prodetail">
    <!-- 顶部返回导航 -->
    <van-nav-bar title="商品详情页" fixed left-arrow @click-left="$router.go(-1)" />

    <!-- 轮播图 -->
    <van-swipe @change="onChange">
      <van-swipe-item v-for="(item, index) in detail.goods_images" :key="index">
        <img :src="item.preview_url" />
      </van-swipe-item>
      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }} / {{ count }}</div>
      </template>
    </van-swipe>

    <!-- 商品信息 -->
    <div class="info">
      <!-- 价格和销量 -->
      <div class="price-volume">
        <!-- 价格 -->
        <div class="price">
          <span class="new">￥{{ detail.goods_price_max }}</span>
          <span class="old">￥{{ detail.goods_price_min }}</span>
        </div>
        <!-- 销量 -->
        <div class="sales">已售{{ detail.goods_sales }}件</div>
      </div>

      <!-- 标题 -->
      <div class="title text-ellipsis-2">
        {{ detail.goods_name }}
      </div>

      <!-- 保障 -->
      <div class="guarantee">
        <div class="left-words">
          <span>
            <van-icon color="#fa2209" name="certificate" />
            七天无理由退货
          </span>
          <span>
            <van-icon color="#fa2209" name="certificate" />
            48小时发货
          </span>
        </div>
        <div class="right-arrow">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- 商品评论 -->
    <div class="comment">
      <!-- 标题 -->
      <div class="comment-title">
        <div class="left">
          商品评价 ({{ commentCount }}条)
        </div>
        <div class="right">
          查看更多
          <van-icon name="arrow" />
        </div>
      </div>
      <!-- 评论列表 -->
      <div class="comment-list">
        <div v-for="(item, index) in commentList" :key="index" class="comment-item">
          <div class="top">
            <img :src="item.user.avatar_url || defaultAvatar" alt="">
            <div class="name">{{ item.user.nick_name }}</div>
            <van-rate :value="item.score/2" color="#ffd21e" void-icon="star" void-color="#eee" />
          </div>
          <div class="content">{{ item.content }}</div>
          <div class="time">{{ item.create_time }}</div>
        </div>
      </div>
    </div>

    <!-- 图片介绍 -->
    <div v-html="detail.content" class="introduce"></div>

    <!-- 底部导航 -->
    <div class="floor">
      <div @click="$router.push('/')" class="icon-o icon-home">
        <van-icon name="wap-home-o" />
        <span>首页</span>
      </div>
      <div @click="$router.push('/cart')" class="icon-o icon-cart">
        <van-icon name="shopping-cart-o" />
        <span>购物车</span>
        <span v-if="cartTotal>0" class="num">{{ cartTotal > 99 ? '99+' : cartTotal }}</span>
      </div>
      <div @click="showActionSheet('cart')" class="bnt bnt-add">加入购物车</div>
      <div @click="showActionSheet('buyNow')" class="bnt bnt-buy">立即购买</div>
    </div>

    <!-- 弹窗 -->
    <van-action-sheet v-model="isShow" :title="mode === 'cart' ?'加入购物车' : '立即购买'">
      <div class="content">
        <!-- 商品 -->
        <div class="title">
          <div class="left">
            <img :src="detail.goods_image" alt="">
          </div>
          <div class="right">
            <div class="price">
              <span>￥</span>
              <span class="new-price">{{ detail.goods_price_max }}</span>
            </div>
            <!-- 库存 -->
            <div class="stock">
              <span>库存 </span>
              <span class="stock-total">{{ detail.stock_total }}</span>
            </div>
          </div>
        </div>

        <!-- 数量 -->
        <div class="num-box">
          <span>数量</span>
          <!-- 数字框组件 -->
          <NumberBox v-model="value"></NumberBox>
        </div>

        <!-- 按钮 -->
        <div class="btn-box">
          <div @click="addBuy" class="btn" :class="{ buyNow: mode === 'buyNow' }">
            {{ mode === 'cart' ? '加入购物车' : '立即购买' }}
          </div>
        </div>
      </div>
    </van-action-sheet>

  </div>
</template>

<script>
import { addCart } from '@/api/cart'
import NumberBox from '@/components/NumberBox'
import defaultAvatar from '@/assets/default-avatar.png'
import { getGoodsCommentCount, getGoodsComment, getGoodsDetail } from '@/api/commodity'
import loginConfirm from '@/mixins/loginConfirm'
export default {
  name: 'ProDetailIndex',
  mixins: [loginConfirm], // 使用 mixins 混入的方法
  components: {
    NumberBox
  },
  data () {
    return {
      value: 1, // 数值框的值
      mode: 'cart', // 弹窗模式
      isShow: false, // 控制弹窗显示
      current: 0,
      detail: {}, // 商品详情
      count: 0, // 轮播图图片数量
      limit: 5, // 每页显示数量
      commentList: [], // 评论列表
      defaultAvatar, // 默认头像
      commentCount: 0, // 评论数量
      cartTotal: this.$store.state.cart.cartTotal // 购物车数量
    }
  },
  created () {
    this.getDtail()
    this.getComment()
    this.getCommentCount()
  },

  computed: {
    goodsId () {
      return this.$route.params.id
    },

    token () {
      return this.$store.getters.token
    }

  },

  methods: {
    // 加入购物车 或 立即购买
    async addBuy () {
      // TODO: 需要登录 -阻止代码继续执行
      if (this.loginConfirm()) {
        return
      }
      // 1. 加入购物车 -调用接口
      const goodsSkuId = this.detail.skuList[0].goods_sku_id
      if (this.mode === 'cart') {
        const { data: { cartTotal } } = await addCart(this.goodsId, this.value, goodsSkuId)
        this.cartTotal = cartTotal

        // 设置 购物车商品个数量
        this.$store.dispatch('cart/setCartTotalActions')
        this.isShow = false
      } else { // 2. 立即购买 -跳转结算页面 -携带商品信息
        this.$router.push({
          path: '/pay',
          query: {
            mode: 'buyNow',
            goodsId: this.goodsId,
            goodsNum: this.value,
            goodsSkuId: goodsSkuId
          }

        })
      }
    },

    // 控制弹窗
    showActionSheet (mode) {
      this.mode = mode
      this.isShow = true
    },
    onChange (index) {
      this.current = index
    },

    // 获取商品详情
    async getDtail () {
      const { data: { detail } } = await getGoodsDetail(this.goodsId)
      this.detail = detail
      this.count = detail.goods_images.length
    },

    // 获取商品评论
    async getComment () {
      const { data: { list } } = await getGoodsComment(this.goodsId, this.limit)
      this.commentList = list
    },

    // 获取商品评论数量
    async getCommentCount () {
      const { data: { total } } = await getGoodsCommentCount(this.goodsId)
      this.commentCount = total.all
    }
  }
}
</script>

<style lang="less" scoped>
.prodetail {
  padding-bottom: 55px;
  padding-top: 46px;
  // 轮播图
  .van-swipe {
    // 轮播图页码
    .custom-indicator {
      position: absolute;
      right: 10px;
      bottom: 10px;
      padding: 5px 10px;
      font-size: 12px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 15px;
    }
    // 轮播图图片
    .van-swipe__track {
      .van-swipe-item {
        img {
          display: block; // 处理图片底部缝隙
          width: 100%;
        }
      }
    }
  }

  // 商品信息
  .info {
    padding: 10px;
    // 价格和销量
    .price-volume {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #959595;
      font-size: 16px;
      .price {
        .new {
          color: #ff4400;
          font-size: 20px;
        }
        .old {
          text-decoration: line-through;
          margin-left: 5px;
        }
      }
    }

    // 标题
    .title {
      margin-top: 5px;
      font-size: 16px;
      line-height: 24px;
    }

    // 保障
   .guarantee {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    line-height: 40px;
    background-color: #fafafa;
    font-size: 16px;
    .left-words {
      span {
        display: inline-flex;
        align-items: center;
        margin-right: 10px;
        .van-icon-certificate {
          margin-right: 4px;
        }
        .van-icon {
          font-size: 18px;
        }
      }
    }
   }
  }

  // 商品评论
  .comment {
    padding: 10px;
    // 标题
    .comment-title {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      .right {
        color: #959595;
      }
    }
    // 评论列表
   .comment-list {
     .comment-item {
      margin-top: 20px;
      line-height: 30px;
      font-size: 16px;
      .top {
        display: flex;
        align-items: center;
        // 星星大小
        .van-icon {
          font-size: 16px;
        }
        img {
          width: 20px;
          height: 20px
        }
        .name {
          margin: 0 10px;
        }
      }
     .time {
        color: #999;
      }
     }
   }
  }

  // 图片介绍
  .introduce {
    width: 100%;
    overflow: scroll;
    ::v-deep img {
      width: 100% !important;
      display: block;
    }
  }

  // 底部导航
 .floor {
    height: 55px;
    width: 100%;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 1px solid #eee;
    z-index: 999;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    .icon-cart {
      position: relative;
      padding: 0 10px 0 4px;
      // 小图标
        .num {
          z-index: 999;
          position: absolute;
          top: -2px;
          left: 37px;
          padding: 0 4px;
          min-width: 16px;
          text-align: center;
          color: #fff;
          font-size: 14px;
          line-height: 16px;
          border-radius: 14px;
          background-color: #ee0a24;
        }
    }
    .icon-o {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .van-icon {
        font-size: 24px;
      }
    }
    .bnt {
      width: 120px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      color: #fff;
      border-radius: 20px;
    }
    .bnt-add {
      background-color: #ffa900;
    }
    .bnt-buy {
      background-color: #fe5630;
    }
  }

  // 弹窗
  .van-action-sheet {
    .content {
      // 商品
      .title {
        display: flex;
        .left {
          width: 90px;
          height: 90px;
          margin: 10px;
          img {
            width: 100%;
            display: block;
          }
        }
        .right {
          flex: 1;
          padding: 10px;
          color: #fe560a;
          font-size: 14px;
          .new-price {
            margin: 0 3px;
            font-size: 24px;
          }
          // 库存
         .stock {
          color: #323233;
          font-size: 16px;
         }
        }
      }

      // 数量
      .num-box {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        align-items: center;
      }

      // 按钮
      .btn-box {
        .btn {
          height: 40px;
          line-height: 40px;
          margin: 20px;
          text-align: center;
          color: #fff;
          border-radius: 20px;
          background-color: #ff9402;
        }
      }

    }
  }

}

// 立即购买按钮
.buyNow {
  background-color: #fe5630 !important;
}

</style>
