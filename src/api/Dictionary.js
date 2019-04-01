import xFetch, { get, post } from '../util/xFetch';
import Service from '../service';

const API = {
  SERVICES_QUERY: `/${Service.platformType}/code/library/list`,
  SERVICES_DETAIL: `/${Service.platformType}/code/library/detail`,
  SERVICES_UPDATA: `/${Service.platformType}/code/library/update`,
  SERVICES_ADD: `/${Service.platformType}/code/library/add`,
  SERVICES_REMOVE: `/${Service.platformType}/code/library/delete`,
}
// 查询服务列表
export const queryList = async (params) => post(API.SERVICES_QUERY, params);

export const queryDetail = async ({ id, userId }) => post(API.SERVICES_DETAIL, { id, userId });

export const updateDisc = async (params) => post(API.SERVICES_UPDATA, params);

export const addDisc = async (params) => post(API.SERVICES_ADD, params);

export const remove = async (params) => post(API.SERVICES_REMOVE, params);