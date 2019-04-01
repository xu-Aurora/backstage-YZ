import { selfFetchManage } from '../api';

export default {
    namespace : 'selfFetchManage',
    state : {
        list: {}
    },
    effects : {
        * serch({ payload: params}, {call, put}){   //自提点列表
            const {jsonResult} = yield call(selfFetchManage.query, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    list: jsonResult.data
                }
            });
        },
        * querySelfFetch({ payload: params}, {call, put}){   //自提点
            const {jsonResult} = yield call(selfFetchManage.selfFetch, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    selfFetch: jsonResult.data
                }
            });
        },
        * detail({payload: params}, {call, put}) {            
            const {jsonResult} = yield call(selfFetchManage.detail, params);
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
        * confirmReceiptPc({payload: {params,func}}, {call, put}) { //取件确认
            yield call(selfFetchManage.confirmReceiptPc, params);
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