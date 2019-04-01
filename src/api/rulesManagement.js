import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    query: `/${Service.platformType}/rule/list`, //查询
    instAdd: `/${Service.platformType}/rule/add`, //新增
    instDetail: `/${Service.platformType}/rule/detail`, //详情    
    instUpdate: `/${Service.platformType}/rule/update`, //更新
    instDelete: `/${Service.platformType}/rule/delete` //删除    
}

export const query = async(params) => post(API.query, params)
export const instAdd = async(params) => post(API.instAdd, params)
export const instDetail = async(params) => post(API.instDetail, params)
export const instUpdate = async(params) => post(API.instUpdate, params)
export const instDelete = async(params) => post(API.instDelete, params)

