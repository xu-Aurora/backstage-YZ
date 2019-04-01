
import { home } from '../api';

export default {
    namespace: 'menu',
    state: {
        data: []
    },
    reducers: {
        querySuccess(state, {
      payload
    }) {
            return {
                ...state,
                ...payload

            };
        }
    },
    effects: {
        * queryMenu({ payload: params }, { call, put }) {
            const { jsonResult } = yield call(home.menu,  params);
            yield put({
                type: 'querySuccess',
                payload: {
                    data: jsonResult.data,
                    message: jsonResult.message
                }
            });
        },
        * Logout({ payload: params }, { call, put }) {
            const { jsonResult } = yield call(home.Logout,  params)
        },
        * updatePwd({
            payload: {
                params,
                func
            }
        }, {call, put}) {
            const {jsonResult} = yield call(home.updatePwd, params);
            if (typeof func === 'function') {
                func();
            }
        }
    }
};
