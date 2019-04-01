import xFetch, { get, post } from '../util/xFetch';
import Service from '../service';

const API = {
  search: `/${Service.platformType}/memberOrder/list`,//列表
  detail: `/${Service.platformType}/memberOrder/detail`,//详情
  refund: `/${Service.platformType}/memberOrder/refund`,//订单退款
}

export const search = async (params) => post(API.search, params);
export const detail = async (params) => post(API.detail, params);
export const refund = async (params) => post(API.refund, params);
