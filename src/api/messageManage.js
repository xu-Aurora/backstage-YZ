import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    messageList: `/${Service.platformType}/message/mng/list`,//消息列表
    messageDetail: `/${Service.platformType}/message/mng/detail`,//消息详情
    smsList: `/${Service.platformType}/sms/send/log/list`,//短信列表
    smsDetail: `/${Service.platformType}/sms/send/log/detail`,//短信详情
}
export const messageList = async(params) => post(API.messageList, params);
export const messageDetail = async(params) => post(API.messageDetail, params);
export const smsList = async(params) => post(API.smsList, params);
export const smsDetail = async(params) => post(API.smsDetail, params);

