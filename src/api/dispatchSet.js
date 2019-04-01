import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    query: `/${Service.platformType}/freight/template/list`, //查询
    detail: `/${Service.platformType}/freight/template/detail`, //详情
    update: `/${Service.platformType}/freight/template/update`, //更新
    add: `/${Service.platformType}/freight/template/add`, //新增
    delete: `/${Service.platformType}/freight/template/delete`, //新增
}

export const query = async(params) => post(API.query, params);
export const detail = async(params) => post(API.detail, params);
export const update = async(params) => post(API.update, params);
export const add = async(params) => post(API.add, params);
export const del = async(params) => post(API.delete, params);
