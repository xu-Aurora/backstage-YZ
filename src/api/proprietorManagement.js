import xFetch, { get, post } from '../util/xFetch';
import Service from '../service';

const API = {
  GET_ZXHS:  `/${Service.platformType}/community/getBuildings`, // 获取幢
  GET_UNIT: `/${Service.platformType}/community/getAddressByPid`, // 获取单元
  GET_HOSE: `/${Service.platformType}/room/list`, // 获取房号
  GET_USER:  `/${Service.platformType}/room/owner/list`, //获取住户
  ADD_USER:  `/${Service.platformType}/room/owner/add`, //新增住户 
  DETAIL_USER:  `/${Service.platformType}/room/owner/detail`, //住户详情
  UPDATE_USER:  `/${Service.platformType}/room/owner/update`, //更新住户
  SET_STATUS:  `/${Service.platformType}/room/owner/statuChange`, //住户状态

}

export const getZxhs = async ( params ) => post(API.GET_ZXHS, params);
export const getUnit = async ( params ) => post(API.GET_UNIT, params);
export const getHose = async ( params ) => post(API.GET_HOSE, params);
export const getUser = async ( params ) => post(API.GET_USER, params);
export const addUser = async ( params ) => post(API.ADD_USER, params);
export const detailUser = async ( params ) => post(API.DETAIL_USER, params);
export const updateUser = async ( params ) => post(API.UPDATE_USER, params);
export const setStatus = async ( params ) => post(API.SET_STATUS, params);
