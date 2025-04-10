<template>
  <div class="login">
    <!-- 顶部返回导航模块 -->
    <van-nav-bar title="会员登录" left-arrow @click-left="$router.go(-1)" />
    <!-- 内容模块 -->
    <div class="container">
      <!-- 标题 -->
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <!-- 输入框 -->
      <div class="form">
        <div class="form-item">
          <input maxlength="11" v-model="mobile" type="text" placeholder="请输入手机号码">
        </div>
        <div class="form-item">
          <input v-model="picCode" type="text" placeholder="请输入图形验证码">
          <img v-if="picUrl" @click="getCaptchaImage" :src="picUrl" alt="">
        </div>
        <div class="form-item">
          <input v-model="smsCode" type="text" placeholder="请输入短信验证码">
          <button @click="getCode">{{ second !== totalSecond ? `重新发送(${this.second})秒` :'获取验证码' }}</button>
        </div>
      </div>
      <!-- 按钮 -->
      <div @click="login" class="login-btn">登录</div>
    </div>
  </div>
</template>

<script>
import { getCaptchaImage, getSmsCaptcha, codeLogin } from '@/api/login'
export default {
  name: 'LoginIndex',
  data () {
    return {
      picKey: '', // 图形验证码的 key
      picUrl: '', // 图形验证码的 base64 图片
      second: 60, // 倒计时数
      totalSecond: 60, // 总秒数 (原来的数)
      time: null, // 定时器 id
      mobile: '', // 手机号码
      picCode: '', // 图形验证码
      smsCode: '' // 短信验证码
    }
  },
  created () {
    this.getCaptchaImage()
  },
  methods: {
    // 获取图形验证码
    async getCaptchaImage () {
      const { data: { base64, key } } = await getCaptchaImage()
      this.picUrl = base64
      this.picKey = key
    },

    // 封装：手机号码、图形验证码校验 方法
    verifi () {
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        this.$toast('请输入正确的手机号码')
        return false
      }
      if (!/^\w{4}$/.test(this.picCode)) {
        this.$toast('请输入正确的图形验证码')
        return false
      }
      return true
    },

    // 倒计时、获取短信验证码（没有挂载在运营商下，模拟一下）
    async getCode () {
      // 校验
      if (!this.verifi()) return

      // 判断 计时器开启否，总秒数和倒计数 相等否
      if (this.time && this.second !== this.totalSecond) return

      // 发起请求获取验证码，并添加提示
      await getSmsCaptcha(this.picCode, this.picKey, this.mobile)
      this.$toast('发送成功，请注意查收')

      // 开启倒计时
      this.time = setInterval(() => {
        this.second--
        // 判断小于 1 恢复值,清除定时器
        if (this.second < 1) {
          this.second = this.totalSecond
          clearInterval(this.time)
          this.time = null
        }
      }, 1000)
    },

    // 登录
    async login () {
      // 校验
      if (!this.verifi()) return

      // 校验 -短信验证码
      if (!/^\d{6}$/.test(this.smsCode)) {
        this.$toast('请输入正确的短信验证码')
        return
      }

      // 发起请求 -获取登录权证信息
      const { data } = await codeLogin(this.mobile, this.smsCode)
      this.$store.commit('user/setUserInfo', data)
      this.$toast('登录成功')

      // 处理商品详情页
      const url = this.$route.query.backUrl || '/'
      // 跳转到首页
      this.$router.replace(url)
    }

  },

  // 销毁定时器
  destroyed () {
    clearInterval(this.time)
    this.time = null
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 50px 30px;

  // 标题
  .title {
    margin-bottom: 30px;
    h3 {
      line-height: 34px;
      font-size: 26px;
      font-weight: 400;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }
  // 表单输入空
  .form-item {
    display: flex;
    // 弹性项目 交叉轴(垂直方向)上居中对齐
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid rgb(243, 241, 242);
    input {
      display: block;
      height: 32px;
      border: 0;
      // 取消输入空获得焦点的样式 (边框加粗,颜色加深)
      outline: none;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: 0;
      color: #cea26a;
      font-size: 13px;
      // 背景透明
      background: transparent;
      margin-right: 9px;
    }
  }
  // 按钮(登录)
  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 40px;
    // 背景渐变
    background: linear-gradient(90deg,#ecb53c, #ff9211 );
    border-radius: 42px;
    // x轴,y轴,模糊度,阴影扩散,颜色
    box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
    color: #fff;
    // 字符之间的间距 (字间距)
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
