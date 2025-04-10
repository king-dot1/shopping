import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cart from './modules/cart'
import address from './modules/address'

Vue.use(Vuex)

export default new Vuex.Store({
  getters: {
    // 全局 token
    token (state) {
      return state.user.userinfo.token
    }
  },
  modules: {
    user,
    cart,
    address

  }
})
