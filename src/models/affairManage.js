import {affairManage} from '../api';

export default {
    namespace : 'affairManage',
    state : {
        list: {}
    },
    effects : {
        * serch({ payload: params}, {call, put}){
            const {jsonResult} = yield call(affairManage.query, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    list: jsonResult.data
                }
            });
        },
        * detail({payload: params}, {call, put}) {            
            const {jsonResult} = yield call(affairManage.detail, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    detail: jsonResult.data
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
        * assignById({payload: {params,func}}, {call, put}) {   //派单
            yield call(affairManage.assignById, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * completeExplain({payload: {params,func}}, {call, put}) {   //结单
            yield call(affairManage.completeExplain, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * closeById({payload: {params,func}}, {call, put}) {   //关闭订单
            yield call(affairManage.closeById, params);
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