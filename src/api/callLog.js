import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    query: `/${Service.platformType}/transaction/log/list`, //查询
    transactionDetail: `/${Service.platformType}/transaction/log/detail` //详情    
}

export const query = async(params) => post(API.query, params)
export const transactionDetail = async(params) => post(API.transactionDetail, params)


