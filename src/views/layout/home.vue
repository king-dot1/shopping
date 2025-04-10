<template>
  <div class="home">
    <!-- 导航条 -->
    <van-nav-bar title="智慧商场" fixed />

    <!-- 搜索框 -->
    <van-search @click="$router.push('/search')" readonly background="#f1f1f2" shape="round" placeholder="请输入搜索关键词" />

    <!-- 轮播图 -->
    <van-swipe indicator-color="#fff" :autoplay="3000">
      <van-swipe-item v-for="(image, index) in swiperList" :key="index">
        <img :src="image.imgUrl" />
      </van-swipe-item>
    </van-swipe>

    <!-- 导航栏 -->
    <van-grid icon-size="40px" :column-num="5">
      <van-grid-item v-for="value in categoryList" :key="value.imgUrl" :icon="value.imgUrl" :text="value.text"
        @click="$router.push('/category')" />
    </van-grid>

    <!-- 主会场（放静态图片即可） -->
    <div class="main">
      <img src="../../assets/main.png" alt="">
    </div>

    <!-- 商品列 -->
    <div class="geuss-list">
      <p class="like">—— 猜你喜欢 ——</p>
      <!-- 封装商品子组件 -->
      <div class="goods-list">
        <GoodsList v-for="(item, index) in floorList" :key="index" :item="item">
        </GoodsList>
      </div>
    </div>

  </div>
</template>

<script>
import GoodsList from '@/components/GoodsList.vue'
import { getHomeData } from '@/api/home'
export default {
  name: 'HomePage',
  components: {
    GoodsList
  },
  data () {
    return {
      swiperList: [], // 图片轮播图
      categoryList: [], // 分类导航
      floorList: [] // 商品楼层数据
    }
  },
  created () {
    this.getHomeData()
  },
  methods: {
    // 获取首页数据
    async getHomeData () {
      const { data: { pageData: { items } } } = await getHomeData()
      this.swiperList = items[1].data
      this.categoryList = items[3].data
      this.floorList = items[6].data
    }

  }
}
</script>

<style lang="less" scoped>
// 主题 padding
.home {
  // margin-top: 99px;
  padding-top: 90px;
  padding-bottom: 50px;
  // 导航条
  .van-nav-bar {
    background: #c21401;
    z-index: 999;
    // ::v-deep 穿透
    ::v-deep .van-nav-bar__title {
        color: #fff;
    }
  }
  // 搜索框定制
  .van-search {
    position: fixed;
    width: 100%;
    top: 46px;
    z-index: 999;
  }

  // 轮播图
  .van-swipe {
    // 图片大小
    .van-swipe-item{
      height: 185px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  // 导航栏

  // 主会场
  .main {
    img {
      // 图片下方缝隙(行内块基线对齐)
      // vertical-align: middle;
      display: block;
      width: 100%;
    }
  }

  // 商品页
  .geuss-list {
    .like {
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
  }

  // 商品列背景
  .goods-list {
    background-color: #f6f6f6;
  }
}
</style>
