import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

import Layout from '@/views/layout'
import Home from '@/views/layout/home.vue'
import Category from '@/views/layout/category.vue'
import Cart from '@/views/layout/cart.vue'
import User from '@/views/layout/user.vue'

const Login = () => import('@/views/login')
const MyOrder = () => import('@/views/myorder')
const orderDetail = () => import('@/views/myorder/orderDetail.vue')
const Pay = () => import('@/views/pay')
const ProDetail = () => import('@/views/prodetail')
const Search = () => import('@/views/search')
const SearchList = () => import('@/views/search/list.vue')
const Address = () => import('@/views/address')
const Create = () => import('@/views/address/create.vue')
const Update = () => import('@/views/address/update.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  // 路由配置
  routes: [
    {
      path: '/',
      component: Layout,
      // 重定向
      redirect: '/home',
      // 二级路由
      children: [
        { path: '/home', component: Home },
        { path: '/category', component: Category },
        { path: '/cart', component: Cart },
        { path: '/user', component: User }
      ]
    },
    { path: '/login', component: Login },
    { path: '/myorder', component: MyOrder },
    { path: '/orderDetail', component: orderDetail },
    { path: '/pay', component: Pay },
    // 商品详情页；携带动态参数
    { path: '/detail/:id', component: ProDetail },
    { path: '/search', component: Search },
    { path: '/searchList', component: SearchList },
    { path: '/address', component: Address },
    { path: '/address/create', component: Create },
    { path: '/address/update', component: Update }
  ]
})

// 定义一个存放 权限页面路径数组
const authUrls = ['/pay', '/myorder', '/address', '/address/create', '/address/update']

// 注册全局前置守卫
// to     往哪里去，往哪里去的路由信息对象
// from   从哪里来，从哪里拉的路由信息对象
// next() 是否放行
// (1) next() 放行；去 to 的路径
// (2) next(路径) 拦截到指定路径页面
router.beforeEach((to, from, next) => {
  const token = store.getters.token
  // 判断 to.path 是否在权限页面 且 是否有 token
  if (authUrls.includes(to.path) && !token) {
    // 拦截到登录页
    next('/login')
  }

  next()
})

export default router
