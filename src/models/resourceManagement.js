import { resourceManagement } from '../api';
import { message } from 'antd';

export default {
  namespace: 'resourceManagement',
  state: {
    organData: [],
    isAddPermis: 1,
    organDeleID: {
      id: null,
      deleRandom: null
    }
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
    * queryList({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(resourceManagement.queryList, params);
      yield put({
        type: 'queryListSuccess',
        payload: {
          organData: jsonResult.data
        }
      });
    },
    * queryDetail({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(resourceManagement.queryPermisDetail, params);
      yield put({
        type: 'queryListSuccess',
        payload: {
          organDetail: jsonResult.data
        }
      });
    },
    * saveId({ payload: params }, { call, put }) {
      yield put({
        type: 'queryListSuccess',
        payload: {
          organDetailID: params
        }
      });
    },
    * deleId({ payload: params }, { call, put }) {
      const userData = JSON.parse(localStorage.getItem('userDetail'));
      const { jsonResult } = yield call(resourceManagement.delePermis, {id: params.id, userId: userData.id});
      yield put({
          type: 'queryListSuccess' ,
          payload: {
            organDeleID: params,
            isAddPermis: Math.random()
          }
      });
    },
    * updatePermis({ payload: params }, { call, put }) {
      const userData = JSON.parse(localStorage.getItem('userDetail'));
      const { jsonResult } = yield call(resourceManagement.updatePermis, {...params, userId: userData.id});
      message.success('更新成功!', 1);
      yield put({ type: 'queryListSuccess',
        payload: { isAddPermis: Math.random() }
      });
    },
    * addPermis({ payload: params }, { call, put }) {
      const userData = JSON.parse(localStorage.getItem('userDetail'));
      const { jsonResult } = yield call(resourceManagement.addPermis, {...params, userId: userData.id});
      message.success('添加成功!', 1);
      yield put({ type: 'queryListSuccess',
        payload: { isAddPermis: Math.random() }
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
