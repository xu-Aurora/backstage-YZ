import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';
import {upload} from '../util/upLoad';

const API = {
    GET_PARAMETER: `/${Service.platformType}/good/parameter/template/list`, //商品参数
    ADD_PARAMETER: `/${Service.platformType}/good/parameter/template/add`, //商品参数
    GET_CATEGORY: `/${Service.platformType}/good/category/findAllCatagory`, //商品分类
    GET_GROUP: `/${Service.platformType}/good/group/list`, //商品分组

    ADD_GOODS:  `/${Service.platformType}/good/add`, //新增商品
    UPDATE_GOODS:  `/${Service.platformType}/good/updateGoodVo`, //更新商品

    DETAIL_GOODS:  `/${Service.platformType}/good/detail`, //商品详情

    GET_AREA: `/${Service.platformType}/area/areaComList`, //小区
    GET_SUPPLIER:  `/${Service.platformType}/supplier/list`, // 商户列表
    GET_FREIGHT: `/${Service.platformType}/freight/template/list`, //快递区域列表

    UPLOAD_IMG: `/${Service.platformType}/upload/upLoadRKey`, //详情页上传图片

}
export const getParameter = async(params) => post(API.GET_PARAMETER, params)

export const addParameter = async(params) => post(API.ADD_PARAMETER, params)

export const getCategory = async(params) => post(API.GET_CATEGORY, params)

export const getgroup = async(params) => post(API.GET_GROUP, params)

export const addGoods = async(params) => post(API.ADD_GOODS, params)
export const upadteGoods = async(params) => post(API.UPDATE_GOODS, params)
export const detailGoods = async(params) => post(API.DETAIL_GOODS, params)

export const getArea = async(params) => post(API.GET_AREA, params);
export const getSupplier = async(params) => post(API.GET_SUPPLIER, params);

export const getFreight = async(params) => post(API.GET_FREIGHT, params);

export const uploadImg = async(params) => upload(API.UPLOAD_IMG, params);


