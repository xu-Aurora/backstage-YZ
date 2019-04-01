import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    query: `/${Service.platformType}/problem/list` //查询
}

export const query = async(params) => post(API.query, params)

