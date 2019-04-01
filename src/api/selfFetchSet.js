import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    query: `/${Service.platformType}/self/raising/list`, 
    delete: `/${Service.platformType}/self/raising/delete`, 
    add: `/${Service.platformType}/self/raising/add`, 
    update: `/${Service.platformType}/self/raising/update`, 
    detail: `/${Service.platformType}/self/raising/detail`, 
    updateState: `/${Service.platformType}/self/raising/updateStateById`, //修改状态
}

export const query = async(params) => post(API.query, params);
export const deleteData = async(params) => post(API.delete, params);
export const add = async(params) => post(API.add, params);
export const update = async(params) => post(API.update, params);
export const detail = async(params) => post(API.detail, params);
export const updateState = async(params) => post(API.updateState, params);






