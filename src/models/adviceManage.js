import {adviceManage} from '../api';

export default {
    namespace : 'adviceManage',
    state : {
        list: {}
    },
    effects : {
        * serch({ payload: params}, {call, put}){
            if(params.type === ''){
                delete params.type
            }
            const {jsonResult} = yield call(adviceManage.query, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    list: jsonResult.data
                }
            });
        },
        * detail({payload: params}, {call, put}) {            
            const {jsonResult} = yield call(adviceManage.detail, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    detail: jsonResult.data
                }
            });
        },
        * instAdd({
            payload: {
                params,
                func
            }
            }, {call, put}) {
            const {jsonResult} = yield call(adviceManage.instAdd, params);
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
            const {jsonResult} = yield call(adviceManage.instDetail, params);
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
            const {jsonResult} = yield call(adviceManage.instDelete, params);
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
            const {jsonResult} = yield call(adviceManage.instUpdate, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * answer({payload: {params,func}}, {call, put}) {
            const {jsonResult} = yield call(adviceManage.answer, params);
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