// 封装商品 API 接口
import request from '@/utils/request'

// 商品列表 -获取商品搜索
export const getGoodsList = (obj) => {
  const { sortType, sortPrice, categoryId, goodsName, page } = obj
  return request.get('/goods/list', {
    params: {
      sortType, // all-综合搜索默认，sales-销量，price-价格
      sortPrice, // 0-价格从低到高，1-价格从高到低
      categoryId, // 分类id
      goodsName, // 商品名称
      page // 页码
    }
  })
}

// 商品详情 -获取商品详情
export const getGoodsDetail = (goodsId) => {
  return request.get('/goods/detail', {
    params: {
      goodsId
    }
  })
}

// 商品详情 -获取商品评论
export const getGoodsComment = (goodsId, limit) => {
  return request.get('/comment/listRows', {
    params: {
      goodsId,
      limit // 获取评论数量
    }
  })
}

// 商品详情 -获取商品评论总数
export const getGoodsCommentCount = (goodsId) => {
  return request.get('/comment/total', {
    params: {
      goodsId
    }
  })
}
