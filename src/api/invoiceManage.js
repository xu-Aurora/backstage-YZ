import xFetch, { get, post } from '../util/xFetch';
import Service from '../service';

const API = {
  search: `/${Service.platformType}/order/invoice/list`,//列表
  detail: `/${Service.platformType}/order/invoice/detail`,//详情
  update: `/${Service.platformType}/order/invoice/update`,//修改发票与核销发票

}

export const search = async (params) => post(API.search, params);
export const detail = async (params) => post(API.detail, params);
export const update = async (params) => post(API.update, params);

