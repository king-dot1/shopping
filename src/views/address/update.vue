<template>
  <div class="create">
    <!-- 顶部返回导航 -->
    <van-nav-bar title="编辑收货地址" left-arrow @click-left="$router.go(-1)" />
    <div class="title">收货地址</div>
    <!-- 收获地址 -->
    <van-form @submit="onSubmit" ref="formInfo" validate-first @failed="onFailed">
      <van-field class="field1" label="姓名" v-model="name" name="name" placeholder="请输入收货人姓名" :rules="formRyles.name" />

      <van-field label="电话" v-model="mobile" name="mobile" placeholder="请输入收货人手机号" :rules="formRyles.mobile" />

      <van-field :rules="formRyles.area" readonly clickable name="area" :value="area" label="地区选择"
        placeholder="请选择省/市/区" @click="showArea = true" />
      <van-popup v-model="showArea" position="bottom">
        <van-area :area-list="areaList1" :value="selectedAreaCode" @confirm="onConfirm" @cancel="showArea = false" />
      </van-popup>

      <van-field class="field2" label="详细地址" v-model="detail" name="detail" placeholder="街道门牌、楼层等信息"
        :rules="formRyles.detail" />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">保存</van-button>
      </div>
    </van-form>

  </div>
</template>

<script>
import { addressDetail, addressEdit } from '@/api/address'
import address from '@/mixins/address'
export default {
  name: 'updatePage',
  mixins: [address], // 使用mixins，调用混入方法
  data () {
    return {
      selectedAreaCode: '100000' // 选中的 code
    }
  },
  async created () {
    // 异步处理
    try {
      // 获取省市区数据
      await this.getRegionTree()
      // 数据处理
      this.getRegionTreeHandler(this.$store.state.address.list)
      // 获取地址详情
      this.getAddressDetail()
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    // 获取地址详情
    async getAddressDetail () {
      const { data: { detail } } = await addressDetail(this.addressId)
      this.detail = detail.detail
      this.name = detail.name
      this.mobile = detail.phone
      this.area = detail.region.province + '/' + detail.region.city + '/' + detail.region.region

      // 拿到区 的code
      const county = this.areaList2.find(item => item.value === detail.province_id)
        .children.find(item => item.value === detail.city_id)
        .children.find(item => item.value === detail.region_id)
      this.selectedAreaCode = county.code

      // 回显 省市区 -初始化数据
      this.region = [
        { value: detail.province_id, label: detail.region.province },
        { value: detail.city_id, label: detail.region.city },
        { value: detail.region_id, label: detail.region.region }
      ]
    },

    // 提交时 传数据发起请求
    async onSubmit () {
      // 编辑地址
      await addressEdit(this.addressId, { name: this.name, phone: this.mobile, region: this.region, detail: this.detail })
      this.$router.go(-1)
    }

  },

  computed: {
    // 获取查询参数
    addressId () {
      return this.$route.query.addressId
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

  .field1 {
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

::v-deep.van-field--error .van-field__control {
  color: #303133;
}
</style>
