import { Dictionary } from '../api';

export default {
  namespace: 'Dictionary',
  state: {
    list: {}
  },
  reducers: {
    queryListSuccess(state, { payload }) {
      return {
        ...state,
        list: {
          ...state.list,
          ...payload
        }
      };
    },
    reload(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    * queryList({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(Dictionary.queryList, params);
      yield put({
        type: 'queryListSuccess',
        payload: {
          data: jsonResult.data
        }
      });
    },
    * remove({ payload: {params, func }}, { call, put }) {

      yield call(Dictionary.remove, params);
      yield put({ type: 'reload' });
      if(typeof func == 'function'){
        func();
      }
    },
    * queryDetail({ payload: {  id, userId } }, { call, put }) {
      const { jsonResult } = yield call(Dictionary.queryDetail, {  id, userId });
      yield put({
        type: 'reload',
        payload: {
          dataDistDetail: jsonResult.data
        }
      });
    },
    * addDisc({ payload: {  params, func } }, { call, put }) {
      const { jsonResult } = yield call(Dictionary.addDisc, params);
      if (typeof func === 'function') {
        func();
      }
    },
    * updateDisc({ payload: {  params, func } }, { call, put }) {
      const { jsonResult } = yield call(Dictionary.updateDisc, params);
      if (typeof func === 'function') {
        func();
      }
    },
    * save({ payload: params }, { call, put }) {
      yield put({
        type: 'reload',
        payload: {
          saveSeslect: params
        }
      });
    }
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
