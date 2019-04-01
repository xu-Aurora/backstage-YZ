import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
p_list : `/${Service.platformType}/module/list`,
p_detail : `/${Service.platformType}/module/detail`,
p_update : `/${Service.platformType}/module/update`,
p_add : `/${Service.platformType}/module/add`,
p_delete : `/${Service.platformType}/module/delete`,
h_list : `/${Service.platformType}/group/list`,
h_detail : `/${Service.platformType}/group/detail`,
h_update : `/${Service.platformType}/group/update`,
h_add : `/${Service.platformType}/group/add`,
h_delete : `/${Service.platformType}/group/delete`
}
// 模块管理增删改查
export const p_list = async(params) => post(API.p_list, params);  

export const p_detail = async(params) => post(API.p_detail, params);

export const p_update = async(params) => post(API.p_update, params);

export const p_add = async(params) => post(API.p_add, params);

export const p_delete = async(params) => post(API.p_delete, params);
// 模块分组管理增删改查
export const h_list = async(params) => post(API.h_list, params);  

export const h_detail = async(params) => post(API.h_detail, params);

export const h_update = async(params) => post(API.h_update, params);

export const h_add = async(params) => post(API.h_add, params);

export const h_delete = async(params) => post(API.h_delete, params);
