import {advertisingManagment} from '../api';

export default {
    namespace : 'advertisingManagment',
    state : {
        list: []
    },
    effects : {
        // 广告位
        * serch({ payload: params}, {call, put}){
            if(params.type === ''){
                delete params.type
            }
        
            const {jsonResult} = yield call(advertisingManagment.query, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    list: jsonResult.data
                }
            });
        },
        * detail({
            payload: params
            }, {call, put}) {            
            const {jsonResult} = yield call(advertisingManagment.detail, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    detail: jsonResult.data
                }
            });
        },
        //广告
        * adQuery({ payload: params}, {call, put}){
            const {jsonResult} = yield call(advertisingManagment.adQuery, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    adList: jsonResult.data
                }
            });
        },
        * adDetail({payload:  {params,func}}, {call, put}) {            
            const {jsonResult} = yield call(advertisingManagment.adDetail, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    adDetail: jsonResult.data
                }
            });
            if (typeof func === 'function') {
                func();
            }
        },
        * adUpdate({payload: {params,func}}, {call, put}) {
            if(params.osskey === ''){
                delete params.osskey
            }
            yield call(advertisingManagment.adUpdate, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * adAdd({ payload: { params,func}}, {call, put}) {
            if(params.areas === ''){
                delete params.areas
                delete params.areascodes
            }
            if(params.comNames === ''){
                delete params.comId
                delete params.comNames
            }
            yield call(advertisingManagment.adAdd, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * deleteImg({payload: {params, func}}, {call, put}) {            
            const {jsonResult} = yield call(advertisingManagment.deleteImg, params);
            if (typeof func === 'function') {
                func();
            }
        },

        * save({payload: params}, {call, put}) {
            yield put({
                type: 'serchSuccess',
                payload: {
                    saveSeslect: params
                }
            });
        },
        * saveIds({payload: params}, {call, put}) {
            yield put({
                type: 'serchSuccess',
                payload: {
                    saveIds: params
                }
            });
        },
        * saveCodes({payload: params}, {call, put}) {
            yield put({
                type: 'serchSuccess',
                payload: {
                    saveCodes: params
                }
            });
        },
        * area({ payload: params}, {call, put}){
            const {jsonResult} = yield call(advertisingManagment.area, params);

            yield put({
                type: 'serchSuccess',
                payload: {
                    area: jsonResult.data
                }
            });
        },

    },
    reducers : {
        serchSuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        }
    }
}