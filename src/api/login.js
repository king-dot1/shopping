// 封装 login (登录) API 接口
import request from '@/utils/request'

// 登录 -获取图形验证码
export const getCaptchaImage = () => {
  return request.get('/captcha/image')
}

// 登录 -获取短信验证码
export const getSmsCaptcha = (captchaCode, captchaKey, mobile) => {
  return request.post('/captcha/sendSmsCaptcha', {
    form: {
      captchaCode,
      captchaKey,
      mobile
    }
  })
}

// 登录 -手机验证码登录
export const codeLogin = (mobile, smsCode) => {
  return request.post('/passport/login', {
    form: {
      isParty: false, // 是否存在第三方用户信息
      partyData: {}, // 三方登录信息，默认为：{}
      mobile,
      smsCode
    }
  })
}
