export default {
  // 此处编写的就是Vue组件实例的 配置项，通过一定语法，可以直接混入到组件内部
  // data methods computd 生命周期函数...
  // 注意：如果组件中也有同名选项，会以组件中的为准
  methods: {
    // 是否需要弹出登录框
    // 1. 需要 返回true
    // 2. 不需要 返回false
    loginConfirm () {
      if (!this.token) {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '此时需要先登录才能继续操作哦!',
          confirmButtonText: '去登录',
          confirmButtonColor: '#ee0a24',
          cancelButtonText: '再逛逛'
        }).then(() => {
          // 确定按钮 -跳转登录页
          const backUrl = '/detail/' + this.goodsId
          this.$router.replace(`/login?backUrl=${backUrl}`)
        }).catch(() => { })
        return true
      }
      return false
    }
  }
}
