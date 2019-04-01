import { providerManage } from '../api';

export default {
  namespace: 'providerManage',
  state: {
    list: []
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
    * getList({ payload: params}, { call, put }) {
        const { jsonResult } = yield call(providerManage.getList, params);
        yield put({
          type: 'querySuccess',
          payload: {
            list: jsonResult.data
          }
        });
    },
    * save({payload: params}, {call, put}) {
      yield put({
          type: 'querySuccess',
          payload: {
              saveSeslect: params
          }
      });
    },
    * getInstitutions({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(providerManage.getInstitutions, params);
      yield put({
        type: 'querySuccess',
        payload: {
          institutionsData: jsonResult.data.list
        }
      });
    },
    * addSupplier({ payload: {params, func}}, { call, put }) {
      const { jsonResult } = yield call(providerManage.addSupplier, params);
      if(typeof func == 'function') {
        func()
      }
    },
    * detailSupplier({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(providerManage.detailSupplier, params);
      yield put({
        type: 'querySuccess',
        payload: {
          detail: jsonResult.data
        }
      });
    },
    * deleteSupplier({ payload: {params, func}}, { call, put }) {
      const { jsonResult } = yield call(providerManage.deleteSupplier, params);
      if(typeof func == 'function') {
        func()
      }
    },
    * updateSupplier({ payload: {params, func}}, { call, put }) {
      const { jsonResult } = yield call(providerManage.updateSupplier, params);
      if(typeof func == 'function') {
        func()
      }
    },
  }
};
