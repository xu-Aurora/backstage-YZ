import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    query: `/${Service.platformType}/activity/list`, //查询
    detail: `/${Service.platformType}/activity/detail`, //详情
    update: `/${Service.platformType}/activity/update`, //更新
    add: `/${Service.platformType}/activity/add`, //新增

    area: `/${Service.platformType}/area/areaComList`, //小区
}

export const query = async(params) => post(API.query, params);
export const detail = async(params) => post(API.detail, params);
export const update = async(params) => post(API.update, params);
export const add = async(params) => post(API.add, params);

export const area = async(params) => post(API.area, params);
export const community = async(params) => post(API.community, params);


