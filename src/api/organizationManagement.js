import xFetch, { get, post } from '../util/xFetch';
import Service from '../service';

const API = {
  GET_TREE: `/${Service.platformType}/property/institutions/institutionsTree`, // 获取机构树
  ADD_INSTITUTIONS: `/${Service.platformType}/property/institutions/add`, // 新增机构
  GET_INSTITUTIONS:  `/${Service.platformType}/property/institutions/list`, // 获取机构
  DETAIL_INSTITUTIONS:  `/${Service.platformType}/property/institutions/detail`, // 机构详情
  DELETE_INSTITUTIONS:  `/${Service.platformType}/property/institutions/deleteByCode`, // 机构删除
  UPDATE_INSTITUTIONS:  `/${Service.platformType}/property/institutions/update` // 机构更新
}

export const getTree = async ( params ) => post(API.GET_TREE, params);
export const addInstitutions = async ( params ) => post(API.ADD_INSTITUTIONS, params);
export const getInstitutions = async ( params ) => post(API.GET_INSTITUTIONS, params);

export const detailInstitutions = async ( params ) => post(API.DETAIL_INSTITUTIONS, params);
export const deleteInstitutions = async ( params ) => post(API.DELETE_INSTITUTIONS, params);
export const updateInstitutions = async ( params ) => post(API.UPDATE_INSTITUTIONS, params);


