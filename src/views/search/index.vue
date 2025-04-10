<template>
  <div class="search">
    <!-- 返回导航 -->
    <van-nav-bar title="商品搜索" left-arrow @click-left="$router.go(-1)" />

    <!-- 搜索框 -->
    <van-search v-model="value" show-action placeholder="请输入搜索关键词">
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>

    <!-- 历史记录 -->
    <div v-if="history.length>0" class="search-history">
      <!-- 标题 -->
      <div class="title">
        <span>最近搜索</span>
        <van-icon @click="clearHistory" name="delete-o" />
      </div>
      <div class="list">
        <div v-for="item in history" :key="item" class="list-item" @click="addSearch(item)">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { setHistoryList, getHistoryList } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  data () {
    return {
      value: '',
      history: getHistoryList() || []
    }
  },
  methods: {
    // 搜索 -添加记录
    onSearch () {
      const value = this.value.trim()
      // 判断不为空；添加到历史记录
      if (value) {
        // 判断是否存在历史记录; -1 不存在
        const index = this.history.indexOf(value)
        if (index !== -1) {
          this.history.splice(index, 1)
        }
        this.history.unshift(value)
        // 存储到本地
        setHistoryList(this.history)
      }

      // 跳转商品(搜索)列表页
      this.$router.push(`/searchList/?search=${value}`)
    },

    // 点击历史记录
    addSearch (item) {
      // 置顶：删除当前记录，添加到历史记录
      const index = this.history.indexOf(item)
      this.history.splice(index, 1)
      this.history.unshift(item)
      // 存储到本地
      setHistoryList(this.history)

      // 跳转商品(搜索)列表页
      this.$router.push(`/searchList/?search=${item}`)
    },

    // 清空历史记录
    clearHistory () {
      this.history = []
      setHistoryList(this.history)
      this.$toast.success('清空历史成功')
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  // 搜索框按钮
  .van-search__action {
    color: #fff;
    background-color: #c21401;
    padding: 0 20px;
    margin-right: 10px;
    border-radius: 0 5px 5px 0;
  }

  // 搜索框历史记录 删除图标
  .search-history {
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
      height: 40px;
      line-height: 40px;
      span {
        font-size: 14px;
      }
    }
  }

  // 搜索历史记录列表
  .list {
    display: flex;
    justify-content:flex-start;
    // 允许换行
    flex-wrap: wrap;
    padding: 0 10px;
    gap: 5%;
    .list-item {
      width: 30%;
      text-align: center;
      padding: 7px;
      border-radius: 20px;
      line-height: 15px;
      background-color: #fff;
      font-size: 13px;
      border: 1px solid #efefef;
      overflow: hidden; // 超出部分隐藏
      white-space: nowrap; // 禁止换行
      text-overflow: ellipsis; // 超出部分省略号显示
      margin-bottom: 10px;
    }
  }
}
</style>
