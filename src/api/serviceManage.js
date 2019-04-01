import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    GET_LIST: `/${Service.platformType}/serviceManage/getServiceInfo`, //服务列表
    GET_DETAIL: `/${Service.platformType}/serviceManage/getServiceInfoById` //服务详情

}
export const getList = async(params) => post(API.GET_LIST, params)

export const getDetail = async(params) => post(API.GET_DETAIL, params)

