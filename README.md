### 预览地址 
https://king-dot1.github.io/shopping-zhihui/#/home
PS:注册时的短信验证码246810
### 作品概括:
购物商场是电商 Web 应用，提供丰富商品购物服务。具备用户登录注册、商品搜索浏览、购物车管理、订单结算支付、订单状态跟踪和个人中心管理功能。用户能查找商品、结算购物车，在个人中心管理订单与收货地址，享受便捷线上购物体验。
### 应用技术：
1)前端框架与组件库：基于 Vue2 搭建架构，借助 Vant 组件库构建页面。利用组件化提升代码复用率，按需导入组件优化性能，加快页面加载。
2)路由与导航：用 Vue Router 实现多级路由和 Tabbar 导航。通过路由导航守卫控制支付、订单等关键页面访问权限，保障用户数据安全。
3)数据管理与请求：采用 Vuex 管理用户和购物车数据，确保数据一致与响应式更新。二次封装 Axios，设置拦截器进行身份验证和错误处理，增强数据请求安全性、稳定性和可维护性。
4)页面适配与优化：借助 PostCSS 插件实现 vw 适配，保证页面在不同移动设备显示良好。运用路由懒加载加快页面加载，打包优化减小文件体积，提升整体性能。
5)数据持久化与组件优化：利用 localStorage 持久化搜索历史、用户登录状态等数据，提高使用便捷性与安全性。封装常用组件，提升代码复用性和项目可维护性。
6)版本控制与部署：开发中用 Git 进行版本控制，通过合理分支管理与代码合并确保代码稳定。完成开发后优化打包并部署到服务器，实现线上运行。

# shopping

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
