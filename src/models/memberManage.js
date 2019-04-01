import { memberManage } from '../api';

export default {
  namespace: 'memberManage',
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
      const { jsonResult } = yield call(memberManage.search, params );
      yield put({
        type: 'querySuccess',
        payload: {
          list: jsonResult.data
        }
      });
    },
    * detail({payload: params}, {call, put}) {            
      const {jsonResult} = yield call(memberManage.detail, params);
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

  },
  subscriptions: {

  }
};
