import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    query: `/${Service.platformType}/good/evaluation/list`, //查询
    detail: `/${Service.platformType}/good/evaluation/detail`, //详情  
    setStatus: `/${Service.platformType}/good/evaluation/updateStatusById` //详情    
}

export const query = async(params) => post(API.query, params)
export const detail = async(params) => post(API.detail, params)
export const setStatus = async(params) => post(API.setStatus, params)



