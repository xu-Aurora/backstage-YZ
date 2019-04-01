import {apiManagement} from '../api';
import {message} from 'antd';

export default {
    namespace : 'apiManagement',
    state : {
        data: [],
        key:"1"
    },
    reducers : {
        queryListSuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        },
        keySuccess(state,{payload}){
            return {
                ...state,
                ...payload
            }
        }
    },
    effects : {
        * key1({
           payload: params
         },{ put }){
             yield put({
                 type: 'keySuccess',
                 payload: {
                     key: params.key
                 }
             })
         },
         * key0({
            payload: params
        },{ put }){
            yield put({
                type: 'keySuccess',
                payload: {
                    key: params.key
                }
            })
        },
        * key2({
            payload: params
        },{ put }){
            yield put({
                type: 'keySuccess',
                payload: {
                    key: params.key
                }
            })
        },
        * p_list({
            payload: params
        }, {call, put}) {
            
            const {jsonResult} = yield call(apiManagement.p_list, params);

            yield put({
                type: 'queryListSuccess',
                payload: {
                    pendingData: jsonResult.data
                }
            });
        },
        * p_save({
            payload: params
        }, {call, put}) {
            yield put({
                type: 'queryListSuccess',
                payload: {
                    p_data: params
                }
            });
        },
        * p_detail({
            payload: params
        }, {call, put}) {

            const {jsonResult} = yield call(apiManagement.p_detail, params);

            yield put({
                type: 'queryListSuccess',
                payload: {
                    pDetail: jsonResult.data
                }
            });
        },
        * p_add({ payload: {  params, func } }, { call, put }) {
            const { jsonResult } = yield call(apiManagement.p_add, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * p_delete({ payload: {  params, func } }, { call, put }) {
            const { jsonResult } = yield call(apiManagement.p_delete, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * p_update({
            payload: {
                params,
                func
            }
        }, {call, put}) {
            const {jsonResult} = yield call(apiManagement.p_update, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * h_list({
            payload: params
        }, {call, put}) {

            const {jsonResult} = yield call(apiManagement.h_list, params);
            yield put({
                type: 'queryListSuccess',
                payload: {
                    throughData: jsonResult.data
                }
            });
        },
        * h_save({
            payload: params
        }, {call, put}) {
            yield put({
                type: 'queryListSuccess',
                payload: {
                    h_data: params
                }
            });
        },
        * h_detail({
            payload: params
        }, {call, put}) {

            const {jsonResult} = yield call(apiManagement.h_detail, params);

            yield put({
                type: 'queryListSuccess',
                payload: {
                    hDetail: jsonResult.data
                }
            });
        },
        * h_add({ payload: {  params, func } }, { call, put }) {
            const { jsonResult } = yield call(apiManagement.h_add, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * h_delete({ payload: {  params, func } }, { call, put }) {
            const { jsonResult } = yield call(apiManagement.h_delete, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * h_update({
            payload: {
                params,
                func
            }
        }, {call, put}) {
            const {jsonResult} = yield call(apiManagement.h_update, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * t_list({
            payload: params
        }, {call, put}) {

            const {jsonResult} = yield call(apiManagement.t_list, params);

            yield put({
                type: 'queryListSuccess',
                payload: {
                    rejectData: jsonResult.data
                }
            });
        },
        * t_save({
            payload: params
        }, {call, put}) {
            yield put({
                type: 'queryListSuccess',
                payload: {
                    t_data: params
                }
            });
        },
        * t_detail({
            payload: params
        }, {call, put}) {

            const {jsonResult} = yield call(apiManagement.t_detail, params);

            yield put({
                type: 'queryListSuccess',
                payload: {
                    tDetail: jsonResult.data
                }
            });
        },
        * t_add({ payload: {  params, func } }, { call, put }) {
            const { jsonResult } = yield call(apiManagement.t_add, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * t_delete({ payload: {  params, func } }, { call, put }) {
            const { jsonResult } = yield call(apiManagement.t_delete, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * t_update({
            payload: {
                params,
                func
            }
        }, {call, put}) {
            const {jsonResult} = yield call(apiManagement.t_update, params);
            if (typeof func === 'function') {
                func();
            }
        }
    }
};
