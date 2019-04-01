import {activityManagement} from '../api';

export default {
    namespace : 'activityManagement',
    state : {
        list: {}
    },
    effects : {
        * serch({ payload: params}, {call, put}){
            if(params.type === ''){
                delete params.type
            }
        
            const {jsonResult} = yield call(activityManagement.query, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    list: jsonResult.data
                }
            });
        },
        * save({payload: params}, {call, put}) {
            yield put({
                type: 'serchSuccess',
                payload: {
                    saveSeslect: params
                }
            });
        },
        * detail({
            payload: params
            }, {call, put}) {            
            const {jsonResult} = yield call(activityManagement.detail, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    detail: jsonResult.data
                }
            });
        },
        * add({ payload: { params,func}}, {call, put}) {
            if(params.areas === ''){
                delete params.areas
                delete params.areascodes
            }
            if(params.comNames === ''){
                delete params.comId
                delete params.comNames
            }
            yield call(activityManagement.add, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * instDelete({
            payload: {params, func}
            }, {call, put}) {
            const {jsonResult} = yield call(activityManagement.instDelete, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * update({payload: {params,func}}, {call, put}) {

            if(params.osskey === ''){
                delete params.osskey
            }

            yield call(activityManagement.update, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * area({ payload: params}, {call, put}){
            const {jsonResult} = yield call(activityManagement.area, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    area: jsonResult.data
                }
            });
        },
        * community({ payload: params}, {call, put}){
            const {jsonResult} = yield call(activityManagement.community, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    community: jsonResult.data
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