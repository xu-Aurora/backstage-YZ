import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
  //图片分组
    queryGroup: `/${Service.platformType}/picture/group/list`, 

  //图片素材
    queryMaterial: `/${Service.platformType}/picture/material/list`,
}

export const queryGroup = async(params) => post(API.queryGroup, params);

export const queryMaterial = async(params) => post(API.queryMaterial, params);





