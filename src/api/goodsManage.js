import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    GET_LIST: `/${Service.platformType}/good/list`, //商品列表 
    GOODS_DETAIL: `/${Service.platformType}/good/detail`, //商品详情
    GOODS_BATCHUPDATE: `/${Service.platformType}/good/batchUpdate`, //上架 2，下架 1，推荐 3
    GET_GROUP: `/${Service.platformType}/good/group/list`, //商品分组
    GOODS_UPDATE: `/${Service.platformType}/good/update`, //商品更新
    GOODS_UPDATEOTHER: `/${Service.platformType}/good/updateOther`, //商品更新其他
    GOODS_COPY: `/${Service.platformType}/good/copyGood`, //复制商品

    setStatus: `/${Service.platformType}/good/updateStatusById`, //详情  
    GET_STOCK: `/${Service.platformType}/good/findGoodStockByGoodId`, //查询商品的库存和价格
    UPDATE_STOCK: `/${Service.platformType}/good/updateGoodStock` //修改商品的库存和价格  
}
export const goodsList = async(params) => post(API.GET_LIST, params)

export const goodsDetail = async(params) => post(API.GOODS_DETAIL, params)
export const goodsUpdate = async(params) => post(API.GOODS_UPDATE, params)
export const goodsUpdateOther = async(params) => post(API.GOODS_UPDATEOTHER, params)

export const goodsBatchUpdate = async(params) => post(API.GOODS_BATCHUPDATE, params)
export const getgroup = async(params) => post(API.GET_GROUP, params)

export const goodsCopy = async(params) => post(API.GOODS_COPY, params)


export const setStatus = async(params) => post(API.setStatus, params)

export const getStock = async(params) => post(API.GET_STOCK, params);
export const updateStock = async(params) => post(API.UPDATE_STOCK, params);

