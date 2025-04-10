<template>
  <div class="create">
    <!-- 顶部返回导航 -->
    <van-nav-bar title="新增收货地址" left-arrow @click-left="$router.go(-1)" />
    <div class="title">收货地址</div>
    <!-- 收获地址 -->
    <van-form @submit="onSubmit" ref="formInfo" validate-first @failed="onFailed">
      <van-field class="field1" label="姓名" v-model="name" name="name" placeholder="请输入收货人姓名" :rules="formRyles.name" />

      <van-field label="电话" v-model="mobile" name="mobile" placeholder="请输入收货人手机号" :rules="formRyles.mobile" />

      <van-field :rules="formRyles.area" readonly clickable name="area" :value="area" label="地区选择" placeholder="请选择省/市/区"
        @click="showArea = true" />
      <van-popup v-model="showArea" position="bottom">
        <van-area :area-list="areaList1" @confirm="onConfirm" @cancel="showArea = false" />
      </van-popup>

      <van-field class="field2" label="详细地址" v-model="detail" name="detail" placeholder="街道门牌、楼层等信息"
        :rules="formRyles.detail" />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>

  </div>
</template>

<script>
import { addressAdd } from '@/api/address'
import address from '@/mixins/address'
export default {
  name: 'createPage',
  mixins: [address], // 使用mixins 调用方法以及变量引入
  data () {
    return {}
  },
  // 组件创建时，异步处理
  async created () {
    try {
      // 获取省市区数据
      await this.getRegionTree()
      // 省市区 数据处理
      this.getRegionTreeHandler(this.$store.state.address.list)
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    // 提交时 传数据发起请求
    async onSubmit () {
      // 添加收货地址
      await addressAdd(this.name, this.mobile, this.region, this.detail)
      this.$router.go(-1)
    }

  }
}
</script>

<style lang="less" scoped>
.create {
  background-color: #fafafa;
  .title {
    margin: 30px 10px;
    margin-bottom: 0;
    color: rgba(69, 90, 100, .6);
    font-size: 16px;
  }
  .field1{
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .field2 {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  .van-form {
    margin: 20px 10px;
    border-radius: 20px;
    .van-button {
      border: 0;
      background: linear-gradient(90deg, #f9211c, #ff6335);
    }
  }

}
/* 深度选择器修改输入框文字颜色 */
::v-deep.van-field--error .van-field__control::placeholder {
  color: #c9c9c9;
}
::v-deep.van-field--error .van-field__control{
  color: #303133;
}

</style>
