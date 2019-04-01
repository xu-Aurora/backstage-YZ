import xFetch, { get, post } from '../util/xFetch';
import Service from '../service';

const API = {
  GET_AREA: `/${Service.platformType}/area/list`, // 获取省市
  GET_COMMUNIS:  `/${Service.platformType}/community/getCommunis`, // 获取左侧小区
  GET_GARDEN:  `/${Service.platformType}/community/comCourtList`, // 获取左侧苑
  GET_INSTITUTIONS:  `/${Service.platformType}/property/institutions/list`, // 获取物业
  ADD_COMMUNIS:  `/${Service.platformType}/community/addCommunity`, // 新增小区
  DETAIL_COMMUNIS:  `/${Service.platformType}/community/detail`, // 小区详情
  UPDATE_COMMUNIS:  `/${Service.platformType}/community/update`, // 小区更新
  
  ADD_BUILDING:  `/${Service.platformType}/address/add`, // 新增幢
  DETAIL_BUILDING: `/${Service.platformType}/address/getJsonByComId`, // 幢详情
  GET_ZXHS:  `/${Service.platformType}/community/getBuildings`, // 获取幢
  GET_UNIT: `/${Service.platformType}/community/getAddressByPid`, // 获取单元或室
  GET_HOSE: `/${Service.platformType}/room/list`, // 获取住户
  
  ADD_ROOM: `/${Service.platformType}/room/add`, // 新增户
  EDIT_ROOM: `/${Service.platformType}/room/update`, // 新增户
  
}

export const getArea = async ( params ) => post(API.GET_AREA, params);

export const getCommunis = async ( params ) => post(API.GET_COMMUNIS, params);
export const getGarden = async ( params ) => post(API.GET_GARDEN, params);
export const getInstitutions = async ( params ) => post(API.GET_INSTITUTIONS, params);
export const addCommunis = async ( params ) => post(API.ADD_COMMUNIS, params);
export const detailCommunis = async ( params ) => post(API.DETAIL_COMMUNIS, params);
export const updateCommunis = async ( params ) => post(API.UPDATE_COMMUNIS, params);

export const addBuilding = async ( params ) => post(API.ADD_BUILDING, params);
export const detailBuilding = async ( params ) => post(API.DETAIL_BUILDING, params);

export const getZxhs = async ( params ) => post(API.GET_ZXHS, params);
export const getUnit = async ( params ) => post(API.GET_UNIT, params);
export const getHose = async ( params ) => post(API.GET_HOSE, params);
export const addRoom = async ( params ) => post(API.ADD_ROOM, params);
export const editRoom = async ( params ) => post(API.EDIT_ROOM, params);


