import xFetch, { get, post } from '../util/xFetch';
import Service from '../service';

const API = {
  search: `/${Service.platformType}/member/list`,//列表
  detail: `/${Service.platformType}/member/detail`,//详情
  // coupon: `/${Service.platformType}/room/owner/listRoomBind`,//详情->粮票记录
}

export const search = async (params) => post(API.search, params);
export const detail = async (params) => post(API.detail, params);
// export const coupon = async (params) => post(API.coupon, params);
