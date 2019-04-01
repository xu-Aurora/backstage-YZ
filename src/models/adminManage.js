import { adminManage } from '../api';

export default {
  namespace: 'adminManage',
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
      const { jsonResult } = yield call(adminManage.search, params );
      yield put({
        type: 'querySuccess',
        payload: {
          list: jsonResult.data
        }
      });
    },
    * queryLists({ payload: {  params, func } }, { call, put }) {
      const { jsonResult } = yield call(adminManage.search, params );
      yield put({
        type: 'querySuccess',
        payload: {
          datas: jsonResult.data
        }
      });
      if (typeof func === 'function') {
        func();
      }
    },
    * detail({payload: params}, {call, put}) {            
      const {jsonResult} = yield call(adminManage.detail, params);
      yield put({
          type: 'querySuccess',
          payload: {
              detail: jsonResult.data
          }
      });
    },
    * save({ payload: params }, { call, put }) {
      yield put({
        type: 'querySuccess',
        payload: {
          saveSeslect: params
        }
      });
    },
    * deleteUser({ payload: {  params, func } }, { call, put }) {
      const { jsonResult } = yield call(adminManage.deleteUser, params);
      if (typeof func === 'function') {
        func();
      }
    },
    * userUpdate({ payload: {  params, func } }, { call, put }) {
      const { jsonResult } = yield call(adminManage.queryUpdate, params);
      if (typeof func === 'function') {
        func();
      }
    },
    * addUser({ payload: {  params, func } }, { call, put }) {
      const { jsonResult } = yield call(adminManage.add, params);
      if (typeof func === 'function') {
        func();
      }
    },
    * instCode({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(adminManage.instCode, params );
      yield put({
        type: 'querySuccess',
        payload: {
          instCode: jsonResult.data
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
