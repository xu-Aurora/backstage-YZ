import xFetch, { get, post } from '../util/xFetch';
import Service from '../service';

const API = {
  search: `/${Service.platformType}/member/coupon/list`,//列表
  detail: `/${Service.platformType}/member/coupon/detail`,//详情
  writeOff: `/${Service.platformType}/member/coupon/writeOff`,//核销卡券
}

export const search = async (params) => post(API.search, params);
export const detail = async (params) => post(API.detail, params);
export const writeOff = async (params) => post(API.writeOff, params);

