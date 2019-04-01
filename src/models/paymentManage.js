import {paymentManage} from '../api';

export default {
    namespace : 'paymentManage',
    state : {
        list: {}
    },
    effects : {
        * serch({ payload: params}, {call, put}){
            const {jsonResult} = yield call(paymentManage.query, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    list: jsonResult.data
                }
            });
        },
        * detail({payload: params}, {call, put}) {            
            const {jsonResult} = yield call(paymentManage.detail, params);
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

        // * answer({payload: {params,func}}, {call, put}) {
        //     const {jsonResult} = yield call(paymentManage.answer, params);
        //     if (typeof func === 'function') {
        //         func();
        //     }
        // },
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