import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
p_list : `/${Service.platformType}/calculation/rule/list`,
p_detail : `/${Service.platformType}/calculation/rule/detail`,
p_update : `/${Service.platformType}/calculation/rule/update`,
p_add : `/${Service.platformType}/calculation/rule/add`,
p_delete : `/${Service.platformType}/calculation/rule/delete`,
h_list : `/${Service.platformType}/calculation/template/list`,
h_detail : `/${Service.platformType}/calculation/template/detail`,
h_update : `/${Service.platformType}/calculation/template/update`,
h_add : `/${Service.platformType}/calculation/template/add`,
h_delete : `/${Service.platformType}/calculation/template/delete`
}
// 计算规则管理增删改查
export const p_list = async(params) => post(API.p_list, params);  

export const p_detail = async(params) => post(API.p_detail, params);

export const p_update = async(params) => post(API.p_update, params);

export const p_add = async(params) => post(API.p_add, params);

export const p_delete = async(params) => post(API.p_delete, params);
// 计算规则模块管理增删改查
export const h_list = async(params) => post(API.h_list, params);  

export const h_detail = async(params) => post(API.h_detail, params);

export const h_update = async(params) => post(API.h_update, params);

export const h_add = async(params) => post(API.h_add, params);

export const h_delete = async(params) => post(API.h_delete, params);
