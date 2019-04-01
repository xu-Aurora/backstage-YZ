import { phoneManage } from '../api';
import { message } from 'antd';

export default {
  namespace: 'phoneManage',
  state: {
  },
  reducers: {
    queryListSuccess(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    * clearRight({ payload: params }, { call, put }) {
      yield put({
        type: 'queryListSuccess',
        payload: {
          communityRight: '',
          gardenRight: ''
        }
      });
    },
    * saveCommunityRight({ payload: params }, { call, put }) {
        yield put({
          type: 'queryListSuccess',
          payload: {
            communityRight: params,
            gardenRight: ''
          }
        });
    },
    * saveGardenRight({ payload: params }, { call, put }) {
        yield put({
          type: 'queryListSuccess',
          payload: {
            gardenRight: params
          }
        });
    },
    * getPhone({ payload: params }, { call, put }) {
        const { jsonResult } = yield call(phoneManage.getPhone, params);
        yield put({
            type: 'queryListSuccess',
            payload: {
            phoneData: jsonResult.data
            }
        });
    },
    * addPhone({ payload:  {params, func} }, { call, put }) {
        const { jsonResult } = yield call(phoneManage.addPhone, params);
        if(typeof func == 'function') {
          func()
        }
    },
    * saveInfo({ payload: params }, { call, put }) {
      yield put({
          type: 'queryListSuccess',
          payload: {
            info: params,
          }
      });
    },
    * detailPhone({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(phoneManage.detailPhone, params);
      yield put({
          type: 'queryListSuccess',
          payload: {
            phoneInfo: jsonResult.data,
          }
      });
      if(typeof func == 'function') {
        func()
      }
    },
    * updatePhone({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(phoneManage.updatePhone, params);
      if(typeof func == 'function') {
        func()
      }
    },
    * deletePhone({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(phoneManage.deletePhone, params);
      if(typeof func == 'function') {
        func()
      }
    }
  }
};
