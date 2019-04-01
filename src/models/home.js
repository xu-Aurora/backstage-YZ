import qs from 'qs';
import { home } from '../api';


export default {
  namespace: 'home',
  state: {
    data: [],
    setStatus: '',
    companyStatus: '1'
  },
  reducers: {
    queryListSuccess(state, {
      payload
    }) {
      return {
        ...state,
        ...payload 
      };
    }
  },
  effects: {
    * queryStatistics({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(home.queryStatistics, params);
      yield put({
        type: 'queryListSuccess',
        payload: {
          Statistics: jsonResult.data
        }
      });
    },
    * setStatus({ payload: params }, { call, put }) {
      yield put({
        type: 'queryListSuccess',
        payload: {
          setStatus: params
        }
      });
    },
    * companyStatus({ payload: params }, { call, put }) {
      yield put({
        type: 'queryListSuccess',
        payload: {
          companyStatus: params
        }
      });
    },
    * querySummaryByDate({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(home.querySummaryByDate, params);
      yield put({
        type: 'queryListSuccess',
        payload: {
          SummaryByDate: jsonResult.data
        }
      });
    },
    * querySummaryByMonth({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(home.querySummaryByMonth, params);
      yield put({
        type: 'queryListSuccess',
        payload: {
          SummaryByMonth: jsonResult.data
        }
      });
    },
    * queryHomeCount({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(home.queryHomeCount, params);
      yield put({
        type: 'queryListSuccess',
        payload: {
          homeCount: jsonResult.data
        }
      });
    },
    * querySummary({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(home.querySummary, params);
      yield put({
        type: 'queryListSuccess',
        payload: {
          Summary: jsonResult.data
        }
      });
    },
    * getAmapinfo({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(home.getAmapinfo, params);
      yield put({
        type: 'queryListSuccess',
        payload: {
          amapData: jsonResult.geocodes
        }
      });
    },
    * reload(action, { put, select }) {
      const data = yield select(state => state.data);
      yield put({
        type: 'fetch',
        payload: {
          data
        }
      });
    },

  }
};
