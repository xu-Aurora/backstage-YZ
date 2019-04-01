import {message} from '../api';

export default {
    namespace : 'message',
    state : {
        data: {},
        userData: {},
        queryUserMsg: false
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
            const {jsonResult} = yield call(message.queryList, params);
            yield put({
                type: 'querySuccess',
                payload: {
                    data: jsonResult.data
                }
            });
        },
        * getList({
            payload: params
        }, {call, put}) {
            const {jsonResult} = yield call(message.getList, params);
            yield put({
                type: 'querySuccess',
                payload: {
                    listData: jsonResult.data
                }
            });
        },
        * add({
            payload: {
                params,
                func
            }
        }, {call, put}) {
            const {jsonResult} = yield call(message.add, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * newsAdd({
            payload: {
                params,
                func
            }
        }, {call, put}) {
            const {jsonResult} = yield call(message.newsAdd, params);
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
            const {jsonResult} = yield call(message.update, params);
            if (typeof func === 'function') {
                func();
            }
            // yield put({   type: 'querySuccess',   payload: {     queryUserMsg: jsonResult.data   } });
        },
        * newsUpdate({
            payload: {
                params,
                func
            }
        }, {call, put}) {
            const {jsonResult} = yield call(message.newsUpdate, params);
            if (typeof func === 'function') {
                func();
            }
            // yield put({   type: 'querySuccess',   payload: {     queryUserMsg: jsonResult.data   } });
        },
        * remove({
            payload: {params,func}
        }, {call, put}) {
            yield call(message.delele, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * newsDelete({
            payload: {
                params,
                func
            }
        }, {call, put}) {
            yield call(message.newsDelete, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * save({
            payload: params
        }, {call, put}) {
            yield put({
                type: 'querySuccess',
                payload: {
                    itemData: params
                }
            });
        },
        * newSave({
            payload: params
        }, {call, put}) {
            yield put({
                type: 'querySuccess',
                payload: {
                    newsData: params
                }
            });
        },
        * reload(action, {put, select}) {
            const page = yield select(state => state.users.page);
            yield put({type: 'fetch', payload: {
                    page
                }});
        },
        * details({payload: params}, {call, put}) {
            const {jsonResult} = yield call(message.newsDetail, params);
            yield put({
                type: 'querySuccess',
                payload: {
                    details: jsonResult.data
                }
            });
        },
        * detail({payload: params}, {call, put}) {
            const {jsonResult} = yield call(message.detail, params);
            yield put({
                type: 'querySuccess',
                payload: {
                    detail: jsonResult.data
                }
            });
        },
    },
    subscriptions : {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                if (pathname === '/services') {
                    dispatch({type: 'fetch', payload: query});
                }
            });
        }
    }
};
