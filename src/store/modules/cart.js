// 构建 vuex 模块，购物车数据存储
import { getCartTotalApi, getCartList, updateCartNum, deleteCart } from '@/api/cart'
import { setCartTotal, getCartTotal } from '@/utils/storage'
export default {
  namespaced: true,
  // 初始化数据
  state () {
    return {
      cartList: [], // 购物车数据
      cartTotal: getCartTotal() // 购物车商品数量
    }
  },
  // 修改数据
  mutations: {
    // 存储购物车数据
    setCartData (state, list) {
      state.cartList = list
    },

    // 复选框状态
    setChecked (state, id) {
      const list = state.cartList.filter(item => item.id === id)
      list[0].isCheck = !list[0].isCheck
    },

    // 全选
    setCheckedAll (state, isAll) {
      state.cartList.forEach(item => {
        item.isCheck = isAll
      })
    },

    // 修改商品数量
    setCartNum (state, obj) {
      const { goodsId, goodsNum } = obj
      const list = state.cartList.filter(item => item.goods_id === goodsId)
      list[0].goods_num = goodsNum
    },

    // 购物车商品数量
    setCartTotalMutations (state, total) {
      // 本地持久化
      setCartTotal(total)
      state.cartTotal = total
    }

  },
  // 异步操作
  actions: {
    // 购物车商品数量
    async setCartTotalActions (context) {
      const { data: { cartTotal } } = await getCartTotalApi()
      context.commit('setCartTotalMutations', cartTotal)
    },

    // 获取购物车数据
    async getCartDataAction (context) {
      const { data: { list } } = await getCartList()
      // 添加复选框状态属性
      list.forEach(item => {
        item.isCheck = true
      })
      context.commit('setCartData', list)
    },

    // 修改商品数量
    async updateCartNumAction (context, obj) {
      const { goodsId, goodsNum, goodsSkuId, oldValue } = obj
      await updateCartNum(goodsId, goodsNum, goodsSkuId)
      // 设置商品数量
      const total = +context.state.cartTotal + (+goodsNum - +oldValue)
      context.commit('setCartTotalMutations', total)
      // 后端请求修改完成；前端修改
      context.commit('setCartNum', obj)
    },

    // 删除
    async delCartAction (context) {
      // 将选中的 id拿出来
      const ids = context.getters.cartIds.split(',')
      await deleteCart(ids)
      context.dispatch('getCartDataAction')
    }

  },
  // 计算属性
  getters: {
    // 获取选中 id
    cartIds (state, getters) {
      const ids = getters.cartCheckedList.map(item => item.id).join(',')
      return ids
    },

    // 商品总数
    cartTotal (state) {
      return state.cartList.reduce((pre, item) => pre + item.goods_num, 0)
    },

    // 选中的商品
    cartCheckedList (state) {
      return state.cartList.filter(item => item.isCheck)
    },

    // 全选中
    cartCheckedAll (state) {
      return state.cartList.every(item => item.isCheck)
    },

    // 选中商品总数
    cartCheckedTotal (state, getters) {
      const list = getters.cartCheckedList
      return list.reduce((pre, item) => pre + item.goods_num, 0)
    },

    // 选中商品总价
    cartCheckedPrice (state, getters) {
      const list = getters.cartCheckedList
      return list.reduce((pre, item) => pre + item.goods_num * item.goods.goods_price_min, 0)
    }
  }
}
