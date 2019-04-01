import xFetch, { get, post } from '../util/xFetch';
import Service from '../service';

const API = {
  search: `/${Service.platformType}/user/list`,//列表
  detail: `/${Service.platformType}/user/detail`,//详情
  add: `/${Service.platformType}/user/add`,//添加
  SERVICES_UPDATE: `/${Service.platformType}/user/restpwd`,//重置密码
  BIND_ROLE: `/${Service.platformType}/role/bangUserRole`,//绑定用户权限
  SERVICES_DELETE: `/${Service.platformType}/user/delete`,//删除用户
  instCode: `/${Service.platformType}/property/institutions/list`,//所属机构
}

export const search = async (params) => post(API.search, params);
export const detail = async (params) => post(API.detail, params);
export const add = async (params) => post(API.add, params);
export const instCode = async (params) => post(API.instCode, params);
export const queryUpdate = async (params) => post(API.SERVICES_UPDATE, params);
export const bangUserRole = async (params) => post(API.BIND_ROLE, params);
export const deleteUser = async (params) => post(API.SERVICES_DELETE, params);
