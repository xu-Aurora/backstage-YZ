import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    query: `/${Service.platformType}/flow/list`, //查询
    flowDetail: `/${Service.platformType}/flow/detail` //详情    
}

export const query = async(params) => post(API.query, params)
export const flowDetail = async(params) => post(API.flowDetail, params)


