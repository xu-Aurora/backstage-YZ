import { home } from '../api';

export default {
  namespace: 'login',
  state: {
    userMsg: {
      id: null,
      loginAccount: null,
      location: null
    },
    data: []
  },
  effects: {
    * saveUser({ payload: { id, name, companyId } }, { call, put }) {
      yield put({
        type: 'user',
        payload: {
          id,
          name,
          companyId
        }
      });
    },
    * queryUser({ payload: { loginAccount, password, code, zhuce } }, { call, put }) {
      const { jsonResult } = yield call(home.user, { loginAccount, password, code });;
      const data = jsonResult.data;
      localStorage.setItem('userDetail', JSON.stringify(data));
      if (typeof zhuce === 'function') {
        zhuce(data.id, data.loginAccount, data.companyId); 
      }
      yield put({
        type: 'loginSuccess',
        payload: {
          data: jsonResult.data
        }
      });
    }
  },
  reducers: {
    user(state, {
      payload
    }) {
      return {
        ...state,
        userMsg: {
          ...state.data,
          ...payload
        }
      };
    },
    loginSuccess(state, {
      payload
    }) {
      return {
        ...state,
        data: {
          ...state.data,
          ...payload
        }
      };
    }
  }
};
