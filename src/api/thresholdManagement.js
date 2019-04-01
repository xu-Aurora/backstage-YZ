import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    GET_LIST: `/${Service.platformType}/threshold/list`,
    delete: `/${Service.platformType}/threshold/delete`,
    add: `/${Service.platformType}/threshold/add`,
    update: `/${Service.platformType}/threshold/update`,
    details: `/${Service.platformType}/threshold/detail`
}

export const queryList = async(params) => post(API.GET_LIST, params);

export const deletes = async(params) => post(API.delete, params);

export const add = async(params) => post(API.add, params);

export const update = async(params) => post(API.update, params);

export const details = async(params) => post(API.details, params);
