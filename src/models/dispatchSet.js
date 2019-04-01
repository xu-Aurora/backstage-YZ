import {dispatchSet} from '../api';

export default {
    namespace : 'dispatchSet',
    state : {
        list: {}
    },
    effects : {
        * serch({ payload: params}, {call, put}){
            const {jsonResult} = yield call(dispatchSet.query, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    list: jsonResult.data
                }
            });
        },
        * detail({payload: {params, func}}, {call, put}) {            
            const {jsonResult} = yield call(dispatchSet.detail, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    detail: jsonResult.data
                }
            });
            if (typeof func === 'function') {
                func();
            }
        },
        * add({payload: { params,func}}, {call, put}) {
            const {jsonResult} = yield call(dispatchSet.add, params);
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
        * update({
            payload: { params,func}}, {call, put}) {
            const {jsonResult} = yield call(dispatchSet.update, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * del({
            payload: { params,func}}, {call, put}) {
            const {jsonResult} = yield call(dispatchSet.del, params);
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