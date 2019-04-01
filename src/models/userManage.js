import { userManage } from '../api';

export default {
  namespace: 'userManage',
  state: {
    list: {},
  },
  reducers: {
    querySuccess(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    * search({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(userManage.search, params );
      yield put({
        type: 'querySuccess',
        payload: {
          list: jsonResult.data
        }
      });
    },
    * detail({payload: params}, {call, put}) {            
      const {jsonResult} = yield call(userManage.detail, params);
      yield put({
          type: 'querySuccess',
          payload: {
              detail: jsonResult.data
          }
      });
    },
    * updateUser({payload: {params,func}}, {call, put}) {
      const {jsonResult} = yield call(userManage.updateUser, params);
      if (typeof func === 'function') {
          func();
      }
    },
    * save({ payload: params }, { call, put }) {
      yield put({
        type: 'querySuccess',
        payload: {
          saveSeslect: params
        }
      });
    },
    * authentication({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(userManage.authentication, params );
      yield put({
        type: 'querySuccess',
        payload: {
          authentication: jsonResult.data
        }
      });
    },

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/services') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    }
  }
};
