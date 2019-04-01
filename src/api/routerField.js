import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    GET_LIST: `/${Service.platformType}/field/list`,
    delete: `/${Service.platformType}/field/delete`,
    add: `/${Service.platformType}/field/add`,
    update: `/${Service.platformType}/field/update`,
    details: `/${Service.platformType}/field/detail`
}

export const queryList = async(params) => post(API.GET_LIST, params);

export const deletes = async(params) => post(API.delete, params);

export const add = async(params) => post(API.add, params);

export const update = async(params) => post(API.update, params);

export const details = async(params) => post(API.details, params);