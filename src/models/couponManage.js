import { couponManage } from '../api';

export default {
  namespace: 'couponManage',
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
      const { jsonResult } = yield call(couponManage.search, params );
      yield put({
        type: 'querySuccess',
        payload: {
          list: jsonResult.data
        }
      });
    },
    * detail({payload: params}, {call, put}) {            
        const {jsonResult} = yield call(couponManage.detail, params);
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
    * refund({ payload: { params, func } }, { call, put }) {
        yield call(couponManage.refund, params);
        if(typeof func === 'function') {
          func()
        }
    },

  },
  subscriptions: {

  }
};
