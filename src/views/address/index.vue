<template>
  <div class="address">
    <!-- 顶部返回导航 -->
    <van-nav-bar fixed title="收货地址" left-arrow @click-left="$router.go(-1)" />

    <!-- 中间内容快 -->
    <div v-if="list.length>0" class="address-list">
      <div v-for="(item, index) in list" :key="index" class="address-item">
        <div class="content">
          <span class="name">{{ item.name }}</span>
          <span class="cell-phone">{{ item.phone }}</span>
        </div>
        <!-- 地址信息 -->
        <div class="address-info">
          <span class="city">{{ item.region.province }}</span>
          <span class="province">{{ item.region.city }}</span>
          <span class="area">{{ item.region.region }}</span>
          <span class="street">{{ item.detail }}</span>
        </div>
        <!-- 操作按钮 -->
        <div class="operation">
          <van-checkbox @click="toggle(index)" :name="index" v-model=item.isChecked checked-color="#ee0a24">{{
            item.isChecked ? '默认' : '选择' }}</van-checkbox>
          <div class="bnt-opera">
            <span @click='$router.push(`/address/update?addressId=${item.address_id}`)' class="edit">
              <van-icon name="records-o" />编辑
            </span>
            <span @click='del(item.address_id)' class="del">
              <van-icon name="delete-o" />删除
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 没有地址时显示 -->
    <div class="empty-content" v-else>
      <div class="empty-icon">
        <img src="../../assets/empty.png" alt="">
      </div>
      <p class="empty-txt">亲，暂无收货地址</p>
    </div>

    <!-- 底部按钮 -->
    <div class="floor">
      <div class="btn" @click="$router.push('/address/create')">添加新地址</div>
    </div>
  </div>
</template>

<script>
import { getAddressList, addressRemove, addressDefaultId, addressSetDefault } from '@/api/address'
export default {
  name: 'addressIndex',
  data () {
    return {
      list: [] // 地址列表
    }
  },
  async created () {
    // 异步处理
    try {
      await this.getAddressList()
      this.getDefaultId()
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    // 获取地址列表
    async getAddressList () {
      const { data: { list } } = await getAddressList()
      // 遍历数组，添加一个状态，默认false
      list.forEach(item => {
        item.isChecked = false
      })
      this.list = list
    },

    // 删除
    del (id) {
      addressRemove(id)
      // 重新渲染
      this.getAddressList()
    },

    // 获取默认地址
    async getDefaultId () {
      const { data: { defaultId } } = await addressDefaultId()
      // defaultId为0时，没有默认地址
      if (defaultId !== 0) {
        this.list.forEach((item, index) => {
          // 找到默认地址，将isChecked设置为true
          if (item.address_id === defaultId) {
            item.isChecked = true
            // 将默认地址放到第一个
            this.list.splice(index, 1)
            this.list.unshift(item)
          }
        })
      }
    },

    // 点击选择，设置默认
    async toggle (index) {
      // 遍历数组，将所有的isChecked设置为false
      this.list.forEach(item => {
        item.isChecked = false
      })
      // 将当前的isChecked设置为true
      this.list[index].isChecked = true
      // 调用接口，设置默认
      await addressSetDefault(this.list[index].address_id)
      // 判断是否需要 回跳订单页
      if (this.$route.query.from === 'checkout') this.$router.go(-1)
    }

  }

}
</script>

<style lang="less" scoped>
.address {
  background-color: #fafafa;
  height: 100vh;
  color: #303133;
  padding-top: 50px;
  .content {
    margin-bottom: 8px;
    .name {
      margin-right: 10px;
    }
  }
  // 内容块
  .address-list {
    font-size: 15px;
    padding-bottom: 60px;
    background-color:#fafafa;
    .address-item {
        background-color: #fff;
        margin: 10px 11px;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(160, 160, 160, 0.1);

        // 地址信息
        .address-info {
          font-size: 14px;
          padding-bottom: 10px;
          margin-bottom: 10px;
          border-bottom: 1px solid #f3f3f3;

          .city,
          .province,
          .area {
            margin-right: 5px;
          }
        }

        // 操作按钮
        .operation {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          ::v-deep.van-checkbox__icon {
            font-size: 10px;
          }

          .bnt-opera {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .edit {
              margin-right: 14px;
            }
          }

          .van-icon {
            font-size: 15px;
          }
        }
    }
  }

  // 空地址显示
  .empty-content {
    padding: 130px 20px;
    text-align: center;
    .empty-icon {
      img {
        width: 140px;
      }
    }
    .empty-txt {
      margin: 25px 0;
      font-size: 14px;
      color: grey
    }
  }

  // 底部按钮
  .floor {
    z-index: 999;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: #fff;
    padding:0 30px;
    display: flex;
    align-items: center;
    .btn {
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      width: 100%;
      background: linear-gradient(90deg, #f9211c, #ff6335);
      border-radius: 20px;
    }
  }

}

</style>
