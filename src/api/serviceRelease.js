import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';
import {upload} from '../util/upLoad';

const API = {
    GET_CATEGORY: `/${Service.platformType}/good/category/findAllCatagory`, //服务分类
    GET_AREA: `/${Service.platformType}/area/areaComList`, //小区
    GET_SUPPLIER:  `/${Service.platformType}/supplier/list`, // 商户列表
    GET_UNIT:  `/${Service.platformType}/codeLibrary/detail`, // 查询单位
    ADD_SERVICE: `/${Service.platformType}/serviceManage/addService`, //新增服务
}

export const getArea = async(params) => post(API.GET_AREA, params);
export const getCategory = async(params) => post(API.GET_CATEGORY, params)
export const getSupplier = async(params) => post(API.GET_SUPPLIER, params);
export const getUnit = async(params) => post(API.GET_UNIT, params);

export const addService = async(params) => post(API.ADD_SERVICE, params);
