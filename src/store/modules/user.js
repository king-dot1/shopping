// vuex 构建 user 模块存储用户信息
import { getInfo, setInfo } from '@/utils/storage'

export default {
  // 开启命名空间
  namespaced: true,

  // 状态（数据）
  state () {
    return {
      userinfo: getInfo() // 默认值：本地获取
    }
  },

  // 修改数据
  mutations: {
    // 持久化用户信息（token & userId）
    setUserInfo (state, obj) {
      state.userinfo = obj
      setInfo(obj)
    }
  },

  // 处理异步
  actions: {
    // 退出登录
    logout (context) {
      // 清除 vuex 中的数据
      context.commit('setUserInfo', {})
      context.commit('cart/setCartTotalMutations', 0, { root: true })
    }
  },

  // 基于 state 派生出来的 计算属性
  getters: {}

}
