import {post} from '../util/xFetch';
import ajax from '../util/ajax';
import qs from 'qs';
import Service from '../service';

export const menu = async(params) => post(`/${Service.platformType}/login/queryMenu`, params);

export const Logout = async(params) => post(`/${Service.platformType}/login/Logout`, params);

export const updatePwd = async(params) => post(`/${Service.platformType}user/updatePwdByUserId`, params);

export const user = async({loginAccount, password, code}) => post(`/${Service.platformType}/login/login`, {loginAccount, password, code});

export const querySummaryByDate = async(params) => post(`/${Service.platformType}/summary/querySummaryByDate`, params);

export const querySummaryByMonth = async(params) => post(`/${Service.platformType}/summary/querySummaryByMonth`, params);

export const querySummary = async(params) => post(`/${Service.platformType}/summary/querySummary`, params);

export const queryHomeCount = async(params) => post(`/${Service.platformType}/user/homeCount`, params);

export const getAmapinfo = async(params) => ajax(`https://restapi.amap.com/v3/geocode/geo?${qs.stringify({
    ...params,
    key: 'fd8208d0e25f8e7888d4d71ba48f9a77',
    appname: 'saisal'
})}`);

export const queryStatistics = async(params) => post(`//${Service.platformType}record/statistics`, params);
