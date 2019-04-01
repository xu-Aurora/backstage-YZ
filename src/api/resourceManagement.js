import xFetch, { get, post } from '../util/xFetch';
import Service from '../service';

const API = {
  GET_TREE: `/${Service.platformType}/permission/getTree`,
  permisDetail: `/${Service.platformType}/permission/detail`,
  updatePermis: `/${Service.platformType}/permission/update`,
  ADDPermis: `/${Service.platformType}/permission/add`,
  deletePermis: `/${Service.platformType}/permission/delete`
}
// 查询服务列表
export const queryList = async ( params ) => post(API.GET_TREE, params);

export const queryPermisDetail = async ( params ) => post(API.permisDetail, params);

export const updatePermis = async ( params ) => post(API.updatePermis, params);

export const addPermis = async ( params ) => post(API.ADDPermis, params);

export const delePermis = async ( params ) => post(API.deletePermis, params);

