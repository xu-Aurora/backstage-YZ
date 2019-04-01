import {rulesManagement} from '../api';
import {message} from 'antd';

export default {
    namespace : 'rulesManagement',
    state : {
        list: {}
    },
    effects : {
        * serch({ payload: params}, {call, put}){
            const {jsonResult} = yield call(rulesManagement.query, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    list: jsonResult.data
                }
            });
        },
        * instAdd({
            payload: {
                params,
                func
            }
        }, {call, put}) {
            const {jsonResult} = yield call(rulesManagement.instAdd, params);
            if (typeof func === 'function') {
                func();
            }

        },
        * save({
            payload: params
        }, {call, put}) {
            yield put({
                type: 'serchSuccess',
                payload: {
                    saveSeslect: params
                }
            });
        },
        * instDetail({
            payload: params
        }, {call, put}) {            
            const {jsonResult} = yield call(rulesManagement.instDetail, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    ItemDetail: jsonResult.data
                }
            });
        },
        * instDelete({
        payload: {params, func}
        }, {call, put}) {
            const {jsonResult} = yield call(rulesManagement.instDelete, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * update({
        payload: {
            params,
            func
        }
        }, {call, put}) {
            const {jsonResult} = yield call(rulesManagement.instUpdate, params);
            if (typeof func === 'function') {
                func();
            }
        }
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