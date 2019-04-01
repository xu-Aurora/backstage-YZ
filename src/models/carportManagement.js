import { carportManagement } from '../api';
import { message } from 'antd';

export default {
  namespace: 'carportManagement',
  state: {
    zxhsData: [],
    unitData: [],
    hoseData: [],
    parkingData: []
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
    * getZxhs({ payload: {params, func} }, { call, put }) {
        const { jsonResult } = yield call(carportManagement.getZxhs, params);
        yield put({
          type: 'queryListSuccess',
          payload: {
            zxhsData: jsonResult.data.list || [],
            unitData: [],
            hoseData: []
          }
        });
        if(typeof func == 'function') {
          func()
        }
    },
    * getUnit({ payload:  {params, func} }, { call, put }) {
        const { jsonResult } = yield call(carportManagement.getUnit, params);
        yield put({
          type: 'queryListSuccess',
          payload: {
            unitData: jsonResult.data.list || [],
            hoseData: []
          }
        });
        if(typeof func == 'function') {
          func()
        }
    },
    * getHose({ payload: {params, func} }, { call, put }) {
        const { jsonResult } = yield call(carportManagement.getHose, params);
        yield put({
            type: 'queryListSuccess',
            payload: {
            hoseData: jsonResult.data.list || [],
            }
        });
        if(typeof func == 'function') {
          func()
        }
    },
    * addParking({ payload:  {params, func} }, { call, put }) {
        const { jsonResult } = yield call(carportManagement.addParking, params);
        if(typeof func == 'function') {
          func()
        }
    },
    * getParking({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(carportManagement.getParking, params);
      yield put({
          type: 'queryListSuccess',
          payload: {
            parkingData: jsonResult.data,
          }
      });
    },
    * saveInfo({ payload: params }, { call, put }) {
      yield put({
          type: 'queryListSuccess',
          payload: {
            info: params,
          }
      });
    },
    * detailParking({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(carportManagement.detailParking, params);
      yield put({
          type: 'queryListSuccess',
          payload: {
            parkingInfo: jsonResult.data,
          }
      });
      if(typeof func == 'function') {
        func()
      }
    },
    * updateParking({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(carportManagement.updateParking, params);
      if(typeof func == 'function') {
        func()
      }
    },
    * deleteParking({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(carportManagement.deleteParking, params);
      if(typeof func == 'function') {
        func()
      }
    },
    * exportParking({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(carportManagement.exportParking, params);
      console.log(jsonResult)
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
