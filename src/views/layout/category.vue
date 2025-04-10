<template>
  <div class="category">
    <!-- 顶部标题 -->
    <van-nav-bar fixed title="全部分类" />

    <!-- 搜索框 -->
    <van-search @click="$router.push('/search')" shape="round" background="#f1f1f2" placeholder="请输入搜索关键词" />

    <!-- 内容块 -->
    <div class="list-box">
      <!-- 左侧列表 -->
      <div class="left">
        <ul>
          <li v-for="(item, index) in list" :key="item.category_id">
            <a :class="{ active: index === activeIndex }" @click="activeIndex = index">{{ item.name }}</a>
          </li>
        </ul>
      </div>
      <!-- 右侧导航 -->
      <div class="right">
        <div @click="$router.push(`/searchList?categoryId=${item.category_id}`)" v-for="(item, index) in list[activeIndex]?.children" :key="index" class="cate-goods">
          <img :src="item?.image?.external_url" :alt="item.name">
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllCategory } from '@/api/category'
export default {
  name: 'CategoryPage',
  data () {
    return {
      list: [], // 分类列表数据
      activeIndex: 0, // 下标变量 控制高亮
      dataLoaded: false // 标记数据是否加载完成
    }
  },

  created () {
    this.getCategoryList()
  },

  methods: {
    // 获取分类列表
    async getCategoryList () {
      const { data: { list } } = await getAllCategory()
      this.list = list
    }
  }

}
</script>

<style lang="less" scoped>
.category {
  // 视口高度
  height: 100vh;
  padding-top: 100px;
  padding-bottom: 50px;

  .van-search {
    position: fixed;
    top: 46px;
    width: 100%;
    z-index: 999;
  }

  // 内容块
  .list-box {
    display: flex;
    height: 100%;

    // 左侧
    .left {
      -webkit-overflow-scrolling: touch;
      width: 85px;
      height: 100%;
      background-color: #f3f3f3;
      overflow: auto;

      a {
        display: block;
        height: 45px;
        line-height: 45px;
        text-align: center;
        font-size: 12px;
        color: #444;

        &.active {
          color: #fb442f;
          background-color: #fff;
        }
      }
    }

    // 右侧
    .right {
      flex: 1;
      height: 100%;
      overflow: auto;
      display: flex;
      flex-wrap: wrap; // 换行
      justify-content: flex-start;
      align-content: flex-start;
      padding: 10px 0;

      // 产品
      .cate-goods {
        width: 33.33%;
        margin-bottom: 10px;

        img {
          display: block;
          width: 70px;
          height: 70px;
          margin: 5px auto;
        }

        p {
          text-align: center;
          font-size: 12px;
        }
      }
    }
  }

  // 导航标题
  .van-nav-bar {
    z-index: 999;
  }
}
</style>
