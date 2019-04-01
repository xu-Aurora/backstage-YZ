import {routerField} from '../api';
import {message} from 'antd';

export default {
    namespace : 'routerField',
    state : {
        data: []
    },
    reducers : {
        querySuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        }
    },
    effects : {
        * queryList({
            payload: params
        }, {call, put}) {
            const {jsonResult} = yield call(routerField.queryList, params);
            yield put({
                type: 'querySuccess',
                payload: {
                    data: jsonResult.data
                }
            });
        },
        * save({
            payload: params
        }, {call, put}) {
            yield put({
                type: 'querySuccess',
                payload: {
                    saveSeslect: params
                }
            });
        },
        * details({
            payload: params
        }, {call, put}) {
            const {jsonResult} = yield call(routerField.details, params);
            yield put({
                type: 'querySuccess',
                payload: {
                    details: jsonResult.data
                }
            });
        },
        * remove({
            payload: {params, func}
        }, {call, put}) {
            const {jsonResult} = yield call(routerField.deletes, params);
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
            const {jsonResult} = yield call(routerField.update, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * add({
            payload: {
                params,
                func
            }
        }, {call, put}) {
            const {jsonResult} = yield call(routerField.add, params);
            if (typeof func === 'function') {
                func();
            }

        }
    }
};
