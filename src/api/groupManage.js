import xFetch, {get, post} from '../util/xFetch';
import Service from '../service';

const API = {
    GET_LIST: `/${Service.platformType}/good/group/list`, //商品分组列表 
    ADD_GROUP: `/${Service.platformType}/good/group/add`, //商品分组添加 
    UPDATE_GROUP: `/${Service.platformType}/good/group/update`, //商品分组更新 
    DELETE_GROUP: `/${Service.platformType}/good/group/delete`, //商品分组详情
    UPDATESTATE_GROUP: `/${Service.platformType}/good/group/updateState`, //商品分组启用禁用
    MOVEUP_GROUP: `/${Service.platformType}/good/group/moveUp`, //商品分组上移
    MOVEDOWN_GROUP: `/${Service.platformType}/good/group/moveDown`, //商品分组下移


    detail: `/${Service.platformType}/good/detail`, //详情  
    setStatus: `/${Service.platformType}/good/updateStatusById` //详情    
}
export const getList = async(params) => post(API.GET_LIST, params)
export const addGroup = async(params) => post(API.ADD_GROUP, params)
export const updateGroup = async(params) => post(API.UPDATE_GROUP, params)
export const deleteGroup = async(params) => post(API.DELETE_GROUP, params)
export const updateStateGroup = async(params) => post(API.UPDATESTATE_GROUP, params)
export const moveUpGroup = async(params) => post(API.MOVEUP_GROUP, params)
export const moveDownGroup = async(params) => post(API.MOVEDOWN_GROUP, params)

export const detail = async(params) => post(API.detail, params)
export const setStatus = async(params) => post(API.setStatus, params)



