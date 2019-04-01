import {salesmanManage} from '../api';

export default {
    namespace : 'salesmanManage',
    state : {
        list: {}
    },
    effects : {
        * serch({ payload: params}, {call, put}){
            const {jsonResult} = yield call(salesmanManage.query, params);
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
            yield call(salesmanManage.add, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * update({payload: {params,func}}, {call, put}) {
            yield call(salesmanManage.update, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * queryDetail({payload: params}, {call, put}) {            
            const {jsonResult} = yield call(salesmanManage.detail, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    detail: jsonResult.data
                }
            });
        },
        * queryDetail1({payload: {params,func}}, {call, put}) {            
            const {jsonResult} = yield call(salesmanManage.detail, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    detail1: jsonResult.data
                }
            });
            if (typeof func === 'function') {
                func();
            }
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