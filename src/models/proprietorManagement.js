import { proprietorManagement } from '../api';
import { message } from 'antd';

export default {
  namespace: 'proprietorManagement',
  state: {
    zxhsData: [],
    unitData: [],
    hoseData: [],
    roleType: '户主'
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
    * setRoleType({ payload: params }, { call, put }) {
      yield put({
        type: 'queryListSuccess',
        payload: {
          roleType: params
        }
      });
    },
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
        const { jsonResult } = yield call(proprietorManagement.getZxhs, params);
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
        const { jsonResult } = yield call(proprietorManagement.getUnit, params);
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
    * getHose({ payload: params }, { call, put }) {
        const { jsonResult } = yield call(proprietorManagement.getHose, params);
        yield put({
            type: 'queryListSuccess',
            payload: {
            hoseData: jsonResult.data.list || [],
            }
        });
    },
    * getUser({ payload:  params}, { call, put }) {
      const { jsonResult } = yield call(proprietorManagement.getUser, params);
      yield put({
        type: 'queryListSuccess',
        payload: {
          userData: jsonResult.data
        }
      })
    },
    * addUser({ payload: {params, func}}, { call, put }) {
      const { jsonResult } = yield call(proprietorManagement.addUser, params);
      if(typeof func == 'function') {
        func()
      }
    },
    * houseInfo({ payload: params }, { call, put }) {
      yield put({
          type: 'queryListSuccess',
          payload: {
            houseInfo: params,
          }
      });
    },
    * detailUser({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(proprietorManagement.detailUser, params);
      yield put({
          type: 'queryListSuccess',
          payload: {
            userDatail: jsonResult.data
          }
      });
    },
    * updateUser({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(proprietorManagement.updateUser, params);
      if(typeof func == 'function') {
        func()
      }
    },
    * setStatus({ payload: {params, func}}, { call, put }) {
      const { jsonResult } = yield call(proprietorManagement.setStatus, params);
      if(typeof func == 'function') {
        func()
      }
    },

    //租户
    * tenantInfo({ payload: params }, { call, put }) {
      yield put({
          type: 'queryListSuccess',
          payload: {
            tenantInfo: params,
          }
      });
    },

    //跳转过来保存信息
    * skipInfo({ payload: params }, { call, put }) {
      yield put({
          type: 'queryListSuccess',
          payload: {
            skipData: params,
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
