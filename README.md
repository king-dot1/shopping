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

### 项目说明
该项目是一个综合性的移动电商平台，涵盖了商品展示、搜索、购物车、订单结算、用户中心等多个核心功能模块
### 应用的技术
#### 前端框架：
  基于Vue2构建项目架构，使用Vant组件库进行页面开发，通过组件化开发提高了代码的复用性和开发效率。
#### 路由管理：
  利用Vue Router实现了灵活的路由配置，包括一级路由和二级路由的设置，以及Tabbar标签页的导航功能，实现了页面间的高效切换和用户导航。
#### 状态管理：
  借助Vuex进行状态管理，对用户信息、购物车数据等进行集中管理，确保数据的一致性和响应式更新，提升了用户体验。
#### 数据请求：
  使用Axios进行数据请求，并对其进行二次封装，设置了请求拦截器和响应拦截器，实现了数据的高效请求和错误处理，同时统一携带token进行身份验证。
#### 页面适配：
  通过PostCSS插件实现vw适配，确保页面在不同移动设备上的完美展示，提高了用户的视觉体验。
#### 组件优化：
  对常用组件进行封装，如数字框组件、地址选择组件等，提高了代码的复用性和项目的可维护性。
#### 数据持久化：
  利用localStorage实现数据持久化，如搜索历史记录、用户登录信息等，提高了用户使用的便捷性和数据的安全性。
#### 项目优化：
  采用路由懒加载技术，提高了页面加载速度，优化了用户体验。同时，对项目进行打包优化，减少了文件体积，提升了项目的性能。

