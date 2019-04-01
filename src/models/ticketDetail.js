import { ticketDetail } from '../api';

export default {
  namespace: 'ticketDetail',
  state: {
    list: {},
  },

  effects: {
    * search({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(ticketDetail.search, params );
      yield put({
        type: 'querySuccess',
        payload: {
          list: jsonResult.data
        }
      });
    },
    * detail({payload: params}, {call, put}) {            
      const {jsonResult} = yield call(ticketDetail.detail, params);
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
    * writeOff({ payload: {  params, func } }, { call, put }) { //核销卡券
      yield call(ticketDetail.writeOff, params);
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
  },

};
