import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    // 广告位
    query: `/${Service.platformType}/ad/space/list`, //查询
    detail: `/${Service.platformType}/ad/space/detail`, //详情
    //广告
    adQuery: `/${Service.platformType}/ad/list`, //查询
    adDetail: `/${Service.platformType}/ad/detail`, //详情
    adUpdate: `/${Service.platformType}/ad/update`, //更新
    adAdd: `/${Service.platformType}/ad/add`, //添加

    area: `/${Service.platformType}/area/areaComList`, //小区

    deleteImg: `/${Service.platformType}/annex/osskeydelete`, //编辑时删除图片
}

export const query = async(params) => post(API.query, params);
export const detail = async(params) => post(API.detail, params);

export const adQuery = async(params) => post(API.adQuery, params);
export const adDetail = async(params) => post(API.adDetail, params);
export const adUpdate = async(params) => post(API.adUpdate, params);
export const adAdd = async(params) => post(API.adAdd, params);

export const area = async(params) => post(API.area, params);
export const community = async(params) => post(API.community, params);

export const showImg = async(params) => get(API.showImg, params);
export const deleteImg = async(params) => post(API.deleteImg, params);

