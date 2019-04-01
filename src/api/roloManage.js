import xFetch, { get, post } from '../util/xFetch';
import Service from '../service';

const API = {
  SERVICES_QUERY: `/${Service.platformType}/role/list`,
  PERMIS_QUERY: `/${Service.platformType}/permission/getDataTree`,
  PERMIS_CONET: `/${Service.platformType}/permission/getByParentIds`,
  addRole: `/${Service.platformType}/role/add`,
  PERMIS_SAVE: `/${Service.platformType}/permission/bangRolePermission`,
  detail: `/${Service.platformType}/role/detail`,
  delete: `/${Service.platformType}/role/delete`,

}
// 查询服务列表
export const queryList = async (params) => post(API.SERVICES_QUERY, params);

export const queryPermisTree = async ({ userId, roleId }) => post(API.PERMIS_QUERY, { userId, roleId });

export const queryParentIds = async ({ userId, roleId, ids }) => post(API.PERMIS_CONET, { userId, roleId, ids });

export const saveRole = async (params) => post(API.PERMIS_SAVE, params);

export const addRole = async (params) => post(API.addRole, params);

export const details = async(params) => post(API.detail, params);

export const deletes = async(params) => post(API.delete, params);
