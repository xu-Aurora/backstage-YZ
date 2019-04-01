import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
  //图片分组
    queryGroup: `/${Service.platformType}/picture/group/list`, 
    deleteGroup: `/${Service.platformType}/picture/group/delete`, 
    addGroup: `/${Service.platformType}/picture/group/add`, 
    updateGroup: `/${Service.platformType}/picture/group/update`, 

  //图片素材
    queryMaterial: `/${Service.platformType}/picture/material/list`,
    detailMaterial: `/${Service.platformType}/picture/material/detail`, 
    updateMaterial: `/${Service.platformType}/picture/material/update`, 
    addMaterial: `/${Service.platformType}/picture/material/add`, 
    deleteMaterial: `/${Service.platformType}/picture/material/delete`, 
    mobilePacket: `/${Service.platformType}/picture/material/mobilePacket`, //移动分组

}

export const queryGroup = async(params) => post(API.queryGroup, params);
export const deleteGroup = async(params) => post(API.deleteGroup, params);
export const addGroup = async(params) => post(API.addGroup, params);
export const updateGroup = async(params) => post(API.updateGroup, params);

export const queryMaterial = async(params) => post(API.queryMaterial, params);
export const detailMaterial = async(params) => post(API.detailMaterial, params);
export const updateMaterial = async(params) => post(API.updateMaterial, params);
export const deleteMaterial = async(params) => post(API.deleteMaterial, params);
export const addMaterial = async(params) => post(API.addMaterial, params);
export const mobilePacket = async(params) => post(API.mobilePacket, params);





