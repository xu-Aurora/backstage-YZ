import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    p_list : `/${Service.platformType}/interfaces/list`,
    p_detail : `/${Service.platformType}/interfaces/detail`,
    p_update : `/${Service.platformType}/interfaces/update`,
    p_add : `/${Service.platformType}/interfaces/add`,
    p_delete : `/${Service.platformType}/interfaces/delete`,
    h_list : `/${Service.platformType}/interface/pmt/list`,
    h_detail : `/${Service.platformType}/interface/pmt/detail`,
    h_update : `/${Service.platformType}/interface/pmt/update`,
    h_add : `/${Service.platformType}/interface/pmt/add`,
    h_delete : `/${Service.platformType}/interface/pmt/delete`,
    t_list : `/${Service.platformType}/error/code/list`,
    t_detail : `/${Service.platformType}/error/code/detail`,
    t_update : `/${Service.platformType}/error/code/update`,
    t_add : `/${Service.platformType}/error/code/add`,
    t_delete : `/${Service.platformType}/error/code/delete`,
}
// 接口管理增删改查
export const p_list = async(params) => post(API.p_list, params);  

export const p_detail = async(params) => post(API.p_detail, params);

export const p_update = async(params) => post(API.p_update, params);

export const p_add = async(params) => post(API.p_add, params);

export const p_delete = async(params) => post(API.p_delete, params);
// 接口字段管理增删改查
export const h_list = async(params) => post(API.h_list, params);  

export const h_detail = async(params) => post(API.h_detail, params);

export const h_update = async(params) => post(API.h_update, params);

export const h_add = async(params) => post(API.h_add, params);

export const h_delete = async(params) => post(API.h_delete, params);
// 接口错误码管理增删改查
export const t_list = async(params) => post(API.t_list, params);  

export const t_detail = async(params) => post(API.t_detail, params);

export const t_update = async(params) => post(API.t_update, params);

export const t_add = async(params) => post(API.t_add, params);

export const t_delete = async(params) => post(API.t_delete, params);