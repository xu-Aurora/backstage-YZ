import xFetch, { get, post } from '../util/xFetch';
import Service from '../service';

const API = {
  GET_ZXHS:  `/${Service.platformType}/community/getBuildings`, // 获取幢
  GET_UNIT: `/${Service.platformType}/community/getAddressByPid`, // 获取单元
  GET_HOSE: `/${Service.platformType}/room/list`, // 获取住户
  ADD_PARKING: `/${Service.platformType}/room/parking/addRoomParking`, // 获取住户  
  GET_PARKING: `/${Service.platformType}/room/parking/list`, // 获取车位
  DETAIL_PARKING:  `/${Service.platformType}/room/parking/detail`, //车位详情
  UPDATE_PARKING:  `/${Service.platformType}/room/parking/update`, //车位更新
  DELETE_PARKING:  `/${Service.platformType}/room/parking/delete`, //车位更新
  EXPORT_PARKING:  `/${Service.platformType}/room/parking/excelRoomParking` //车位导出

}

export const getZxhs = async ( params ) => post(API.GET_ZXHS, params);
export const getUnit = async ( params ) => post(API.GET_UNIT, params);
export const getHose = async ( params ) => post(API.GET_HOSE, params);

export const addParking = async ( params ) => post(API.ADD_PARKING, params);
export const getParking = async ( params ) => post(API.GET_PARKING, params);

export const detailParking = async ( params ) => post(API.DETAIL_PARKING, params);
export const updateParking = async ( params ) => post(API.UPDATE_PARKING, params);

export const deleteParking = async ( params ) => post(API.DELETE_PARKING, params);
export const exportParking = async ( params ) => get(API.EXPORT_PARKING, params);
