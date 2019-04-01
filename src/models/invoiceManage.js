import { invoiceManage } from '../api';

export default {
  namespace: 'invoiceManage',
  state: {
    list: {},
  },
  effects: {
    * serch({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(invoiceManage.search, params );
      yield put({
        type: 'querySuccess',
        payload: {
          list: jsonResult.data
        }
      });
    },
    * detail({payload: params}, {call, put}) {            
      const {jsonResult} = yield call(invoiceManage.detail, params);
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
    * update({ payload: {  params, func } }, { call, put }) { //修改发票,核销发票,上传发票
      yield call(invoiceManage.update, params);
      if (typeof func === 'function') {
        func();
      }
    },
  },
  reducers: {
    querySuccess(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  }

};
