import xFetch, { get, post } from '../util/xFetch';
import Service from '../service';

const API = {
  GET_PHONE: `/${Service.platformType}/community/phone/backstageAll`, // 电话列表
  ADD_PHONE:  `/${Service.platformType}/community/phone/add`, //电话新增
  DETAIL_PHONE:  `/${Service.platformType}/community/phone/detail`, //电话详情
  UPDATE_PHONE:  `/${Service.platformType}/community/phone/update`, //电话更新
  DELETE_PHONE:  `/${Service.platformType}/community/phone/delete` //电话删除
}

export const getPhone = async ( params ) => post(API.GET_PHONE, params);
export const addPhone = async ( params ) => post(API.ADD_PHONE, params);

export const detailPhone = async ( params ) => post(API.DETAIL_PHONE, params);
export const updatePhone = async ( params ) => post(API.UPDATE_PHONE, params);

export const deletePhone = async ( params ) => post(API.DELETE_PHONE, params);
