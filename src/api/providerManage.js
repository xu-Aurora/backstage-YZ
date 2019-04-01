import xFetch, { get, post } from '../util/xFetch';
import Service from '../service';

const API = {
  GET_LIST:  `/${Service.platformType}/supplier/list`, // 商户列表
  GET_INSTITUTIONS:  `/${Service.platformType}/property/institutions/list`, // 机构列表
  ADD_SUPPLIER:  `/${Service.platformType}/supplier/add`, // 新增商户
  DETAIL_SUPPLIER: `/${Service.platformType}/supplier/detail`,// 商户详情
  DELETE_SUPPLIER: `/${Service.platformType}/supplier/delete`,// 商户删除
  UPDATE_SUPPLIER: `/${Service.platformType}/supplier/update`,// 商户更新

}

export const getList = async ( params ) => post(API.GET_LIST, params);
export const getInstitutions = async ( params ) => post(API.GET_INSTITUTIONS, params);
export const addSupplier = async ( params ) => post(API.ADD_SUPPLIER, params);
export const detailSupplier = async ( params ) => post(API.DETAIL_SUPPLIER, params);
export const deleteSupplier = async ( params ) => post(API.DELETE_SUPPLIER, params);
export const updateSupplier = async ( params ) => post(API.UPDATE_SUPPLIER, params);


