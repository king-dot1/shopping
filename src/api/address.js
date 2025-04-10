// 封装收货地址 API 接口
import request from '@/utils/request'

// 获取省市区 -添加地址
export const getRegionTree = () => {
  return request.get('/region/tree')
}

// 收货地址列表
export const getAddressList = () => {
  return request.get('/address/list')
}

// 添加收货地址
export const addressAdd = (name, phone, region, detail) => {
  return request.post('/address/add', {
    form: {
      name,
      phone,
      region,
      detail
    }
  })
}

// 获取收货地址详情
export const addressDetail = (addressId) => {
  return request.get('/address/detail', {
    params: { addressId }
  })
}

// 编辑收货地址
export const addressEdit = (addressId, data) => {
  const { name, phone, region, detail } = data
  return request.post('/address/edit', {
    addressId, // 地址id
    form: {
      name,
      phone,
      region,
      detail
    }
  })
}

// 删除收货地址
export const addressRemove = (addressId) => {
  request.post('/address/remove', { addressId })
}

// 获取默认地址 id
export const addressDefaultId = () => {
  return request.get('/address/defaultId')
}

// 设置默认地址
export const addressSetDefault = (addressId) => {
  request.post('/address/setDefault', { addressId })
}
