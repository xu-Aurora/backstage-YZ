import {selfFetchSet} from '../api';

export default {
    namespace : 'selfFetchSet',
    state : {
        list: {}
    },
    effects : {
        * serch({ payload: params}, {call, put}){
            const {jsonResult} = yield call(selfFetchSet.query, params);
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
        * add({ payload: { params,func}}, {call, put}) {
            yield call(selfFetchSet.add, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * deleteData({payload: {params, func}}, {call, put}) {
            const {jsonResult} = yield call(selfFetchSet.delete, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * update({payload: {params,func}}, {call, put}) {
            const {jsonResult} = yield call(selfFetchSet.update, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * updateState({payload: {params,func}}, {call, put}) {
            const {jsonResult} = yield call(selfFetchSet.updateState, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * detail({payload: params}, {call, put}) {            
            const {jsonResult} = yield call(selfFetchSet.detail, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    detail: jsonResult.data
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