import xFetch, { get, post } from '../util/xFetch';
import Service from '../service';

const API = {
  search: `/${Service.platformType}/cifUser/findPropertyUser`,//列表
  detail: `/${Service.platformType}/cifUser/detailUser`,//详情
  authentication: `/${Service.platformType}/user/room/bind/userRooms`,//详情->认证信息
  updateUser: `/${Service.platformType}/cifUser/updatePropertyUser`,//详情->启用/禁用
}

export const search = async (params) => post(API.search, params);
export const detail = async (params) => post(API.detail, params);
export const authentication = async (params) => post(API.authentication, params);
export const updateUser = async (params) => post(API.updateUser, params);
