import { getRegionTree } from '@/api/address'
export default {
  // 实现 修改页面 和 创建页面的变量和方法复用
  data () {
    return {
      name: '', // 名字
      mobile: '', // 电话
      region: [], // 地址 value label
      area: '', // 地区
      detail: '', // 详细地址
      showArea: false, // 弹窗状态
      areaList1: { // 存储 展示数据
        province_list: {},
        city_list: {},
        county_list: {}
      },
      areaList2: [], // 存储 value 数据
      formRyles: { // 校验规则
        name: [
          { required: true, message: '请输入名字' }
        ],
        // 手机号校验规则
        mobile: [
          { required: true, message: '请填手机号' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确手机号'
          }
        ],
        area: [
          { required: true, message: '请选择地区' }
        ],
        detail: [
          { required: true, message: '请输入详细地址' }
        ]
      }
    }
  },

  methods: {
    // 提交时 错误提示文字
    onFailed (error) {
      this.$toast(error.errors[0].message)
    },

    // 地址选择时 回显
    onConfirm (values) {
      // 地址 -数据处理
      // 根据 code 查找 省、市、区的 value
      const province = this.areaList2.find(item => item.code === values[0].code)
      const city = province.children.find(item => item.code === values[1].code)
      const county = city.children.find(item => item.code === values[2].code)

      this.region = [
        { value: province.value, label: province.name },
        { value: city.value, label: city.name },
        { value: county.value, label: county.name }
      ]

      this.area = values
        .filter((item) => !!item)
        .map((item) => item.name)
        .join('/')
      this.showArea = false
    },

    // 获取地区数据
    async getRegionTree () {
      // 缓存中是否有数据
      const regionTree = this.$store.state.address.list
      if (Object.keys(regionTree).length > 0) {
        // 有数据，直接处理数据
        this.getRegionTreeHandler(regionTree)
        return
      }
      const { data: { list } } = await getRegionTree()
      this.$store.commit('address/setRegionTreeMutation', list)
    },

    // 获取地区数据处理
    async getRegionTreeHandler (list) {
      const provinceKeys = Object.keys(list)
      // 循环 处理省
      provinceKeys.forEach((provinceKey, provinceIndex) => {
        const province = list[provinceKey]
        const provinceCode = (10 + provinceIndex).toString().padEnd(6, '0')
        this.areaList1.province_list[provinceCode] = province.name
        // value 的存储
        this.areaList2[provinceIndex] = { code: provinceCode, value: province.id, name: province.name, children: [] }
        // 判断 是否有市
        if (province.city) {
          const cityKeys = Object.keys(province.city)
          // 循环 处理市
          cityKeys.forEach((cityKey, cityIndex) => {
            const city = province.city[cityKey]
            // code 前两位省 中间两位市 后两位区
            const cityCode = (10 + provinceIndex).toString() + (cityIndex + 1).toString().padStart(2, '0') + '00'
            this.areaList1.city_list[cityCode] = city.name
            // ******
            this.areaList2[provinceIndex].children[cityIndex] = { code: cityCode, value: city.id, name: city.name, children: [] }

            // 判断 是否有区
            if (city.region) {
              const countyKeys = Object.keys(city.region)
              // 循环 处理市
              countyKeys.forEach((countyKey, countyIndex) => {
                const county = city.region[countyKey]
                // code 前两位省 中间两位市 后两位区
                const countyCode = (10 + provinceIndex).toString() + (cityIndex + 1).toString().padStart(2, '0') + (countyIndex + 1).toString().padStart(2, '0')
                this.areaList1.county_list[countyCode] = county.name
                // ******
                this.areaList2[provinceIndex].children[cityIndex].children[countyIndex] = { code: countyCode, value: county.id, name: county.name }
              })
            }
          })
        }
      })
    }
  }
}
