// 构建 vuex 模块，存储地址信息
import { setAddress, getAddress } from '@/utils/storage'
export default {
  namespaced: true,
  // 初始化数据
  state () {
    return {
      list: getAddress() || {}
    }
  },
  // 修改数据
  mutations: {
    setRegionTreeMutation (state, list) {
      state.list = list
      // 本地持久化
      setAddress(list)
    }
  },
  // 异步操作
  actions: {},
  // state 派生的数据
  getters: {}
}
