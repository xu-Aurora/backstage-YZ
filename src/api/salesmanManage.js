import { post} from '../util/xFetch';
import Service from '../service';

const API = {
    query: `/${Service.platformType}/salesman/list`, 
    detail: `/${Service.platformType}/salesman/detail`, 
    update: `/${Service.platformType}/salesman/update`, 
    add: `/${Service.platformType}/salesman/add`, 
}

export const query = async(params) => post(API.query, params);
export const detail = async(params) => post(API.detail, params);
export const update = async(params) => post(API.update, params);
export const add = async(params) => post(API.add, params);
