import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    query: `/${Service.platformType}/complaint/order/list`, //查询
    detail: `/${Service.platformType}/complaint/order/detail`, //详情
    answer: `/${Service.platformType}/complaint/order/answerUpdate`, //待审核列表答复
}

export const query = async(params) => post(API.query, params);
export const detail = async(params) => post(API.detail, params);
export const answer = async(params) => post(API.answer, params);
