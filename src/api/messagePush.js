import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    queryList: `/${Service.platformType}/send/task/list`,
    queryDetail: `/${Service.platformType}/send/task/detail`,
    add: `/${Service.platformType}/send/task/add`,
}
export const queryList = async(params) => post(API.queryList, params);
export const queryDetail = async(params) => post(API.queryDetail, params);
export const add = async(params) => post(API.add, params);

