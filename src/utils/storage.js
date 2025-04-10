// 封装 storage 存储模块

const INFO_KEY = 'shopping_info'

// 设置 -个人信息
export const setInfo = (info) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(info))
}

// 获取 -个人信息
export const getInfo = () => {
  // 本地没有数据，返回一个对象
  const result = localStorage.getItem(INFO_KEY)
  return result ? JSON.parse(result) : { token: '', userId: '' }
}

// 移除 -个人信息
export const removeInfo = () => {
  localStorage.removeItem(INFO_KEY)
}

// 搜索记录
const HISTORY_LIST_KEY = 'shopping_history'

// 设置 -历史记录
export const setHistoryList = (list) => {
  localStorage.setItem(HISTORY_LIST_KEY, JSON.stringify(list))
}

// 获取 -历史记录
export const getHistoryList = () => {
  const result = localStorage.getItem(HISTORY_LIST_KEY)
  return result ? JSON.parse(result) : []
}

// 移除 -历史记录
export const removeHistoryList = () => {
  localStorage.removeItem(HISTORY_LIST_KEY)
}

const ADDRESS_KEY = 'shopping_tree'
// 设置 -地址省市区
export const setAddress = (address) => {
  localStorage.setItem(ADDRESS_KEY, JSON.stringify(address))
}

// 获取 -地址省市区
export const getAddress = () => {
  const result = localStorage.getItem(ADDRESS_KEY)
  return result ? JSON.parse(result) : {}
}

// 设置 -购物车商品数量
const CART_TOTAL_KEY = 'shopping_cart_total'
export const setCartTotal = (total) => {
  localStorage.setItem(CART_TOTAL_KEY, total)
}

// 获取 -购物车商品数量
export const getCartTotal = () => {
  return localStorage.getItem(CART_TOTAL_KEY) || 0
}
