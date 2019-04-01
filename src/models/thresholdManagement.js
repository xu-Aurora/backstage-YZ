import {thresholdManagement} from '../api';
import {message} from 'antd';

export default {
    namespace : 'thresholdManagement',
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
        * testData({
            payload: params
        }, {call, put}) {
            const testdata = [{x1: '1000000000', x2: '60', type: 'LessOREqual' }];
            yield put({
                type: 'querySuccess',
                payload: {
                    testData: testdata
                }
            });
        },
        * queryList({
            payload: params
        }, {call, put}) {
            const {jsonResult} = yield call(thresholdManagement.queryList, params);
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
            const {jsonResult} = yield call(thresholdManagement.details, params);
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
                const {jsonResult} = yield call(thresholdManagement.deletes, params);
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
            const {jsonResult} = yield call(thresholdManagement.update, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * addProduct({
            payload: {
                params,
                func
            }
        }, {call, put}) {
            const {jsonResult} = yield call(thresholdManagement.add, params);
            if (typeof func === 'function') {
                func();
            }

        }
    }
};
