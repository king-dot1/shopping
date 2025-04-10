<template>
  <div class="search-list">
    <!-- 返回导航 -->
    <van-nav-bar title="商品列表" left-arrow @click-left="$router.go(-1)" />

    <!-- 搜索框 -->
    <van-search shape="round" readonly show-action :value="querySearch || '搜索商品'">
      <template #action>
        <van-icon size="25px" name="list-switch"></van-icon>
      </template>
    </van-search>

    <!-- 切换展示（排序） -->
    <div class="sort-btns" @click="cutShow">
      <div data-cut='all' class="sort-item sort-item--active">综合</div>
      <div data-cut='sales' class="sort-item">销量</div>
      <div data-cut='price' class="sort-item">价格</div>
    </div>

    <!-- 商品列 -->
    <div class="goods-list">
      <GoodsList v-for="(item, index) in list" :key="index" :item="item"></GoodsList>
    </div>

  </div>
</template>

<script>
import GoodsList from '@/components/GoodsList.vue'
import { getGoodsList } from '@/api/commodity'
export default {
  name: 'SearchList',
  components: {
    GoodsList
  },
  data () {
    return {
      list: [], // 商品列表
      sortType: 'all', // all-综合搜索默认，sales-销量，price-价格
      sortPrice: '0', // 0-价格从低到高，1-价格从高到低
      page: '1' // 页码
    }
  },
  created () {
    this.getGoods()
  },

  methods: {
    // 获取 -商品列表
    async getGoods () {
      const { data: { list: { data } } } = await getGoodsList({
        sortType: this.sortType,
        sortPrice: this.sortPrice,
        page: this.page,
        goodsName: this.querySearch,
        categoryId: this.queryCategoryId
      })
      this.list = data
    },

    // 切换展示（排序）委托事件
    cutShow (e) {
      this.sortType = e.target.dataset.cut || 'all'
      // 移除所有高亮
      const sortItem = document.querySelectorAll('.sort-item')
      sortItem.forEach(item => item.classList.remove('sort-item--active'))
      e.target.classList.add('sort-item--active')
      // 发起请求
      this.getGoods()
    }
  },
  computed: {
    // 获取查询参数 -搜索关键字
    querySearch () {
      return this.$route.query.search
    },

    // 获取查询参数 -分类id
    queryCategoryId () {
      return this.$route.query.categoryId
    }
  }
}
</script>

<style lang="less" scoped>
.search-list {
  // 搜索框
  .van-search {
    // 图标
    .van-search__action {
      display: flex;
      justify-content: center;
      align-items: center;
    }
 }

  // 切换展示（排序）
 .sort-btns {
    display: flex;
    height: 36px;
    line-height: 36px;
    .sort-item {
      flex: 1;
      text-align: center;
      font-size: 16px;
   }
 }

  // 商品列背景
  .goods-list {
    background-color: #f6f6f6;
  }

}

// 切换展示高亮
.sort-item--active {
  color: #c21401;
}

</style>
