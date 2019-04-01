import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    LIST_QUERY: `/${Service.platformType}/news/list`,
    SERVICES_QUERY: `/${Service.platformType}/news/templet/list2`,
    SERVICES_NEWUSER: `/${Service.platformType}/news/templet/add2`,
    SERVICES_UPDATE: `/${Service.platformType}/news/templet/update2`,
    SERVICES_DELETE: `/${Service.platformType}/news/templet/delete`,
    SERVICES_DETAIL: `/${Service.platformType}/news/templet/detail`,
    newsAdd: `/${Service.platformType}/news/add`,
    newsUpdate: `/${Service.platformType}/news/update`,
    newsDelete: `/${Service.platformType}/news/delete`,
    newsDetail: `/${Service.platformType}/news/detail`
}
// 模板列表
export const queryList = async(params) => post(API.SERVICES_QUERY, params);
//新增模板
export const add = async(params) => post(API.SERVICES_NEWUSER, params);
//删除模板
export const delele = async({id, userId}) => post(API.SERVICES_DELETE, {id, userId});
//更新模板
export const update = async(params) => post(API.SERVICES_UPDATE, params);
//模板详情
export const detail = async(params) => post(API.SERVICES_DETAIL, params);
//消息列表
export const getList = (params) => post(API.LIST_QUERY, params);
//新增消息
export const newsAdd = async(params) => post(API.newsAdd, params);
//删除消息
export const newsDelete = async({id, userId}) => post(API.newsDelete, {id, userId});
//更新消息
export const newsUpdate = async(params) => post(API.newsUpdate, params);
//消息详情
export const newsDetail = async(params) => post(API.newsDetail, params);
