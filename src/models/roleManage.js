import { roloManage } from '../api';
import { message } from 'antd';

export default {
  namespace: 'roloManage',
  state: {
    list: {
      items: [],
      total: null,
      page: null,
      size: 10
    },
  },
  reducers: {
    queryListSuccess(state, { payload }) {
      return {
        ...state,
        ...payload
        
      };
    },
    reload(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    queryPermissSuccess(state, { payload }) {
      return {
        ...state,
        ...payload
        
      };
    },
    queryParentIdsSuccess(state, { payload }) {
      return {
        ...state,
        ...payload
        
      };
    }
  },
  effects: {
    * queryList({ payload: params }, { call, put }) {
      if (!params.size && !params.requestType) {
        params.size = '10';
      }
      const { jsonResult } = yield call(roloManage.queryList, params);
      yield put({
        type: 'queryListSuccess',
        payload: {
          data: jsonResult.data
        }
      });
    },
    * details({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(roloManage.details, params);
      yield put({
        type: 'queryListSuccess',
        payload: {
          details: jsonResult.data
        }
      });
    },
    * queryPermisTree({ payload: { userId, roleId, func } }, { call, put }) {
      const { jsonResult } = yield call(roloManage.queryPermisTree, { userId, roleId});
      const ID = [];
      const checkeID = [];
      jsonResult.data.forEach((item) => {
        ID.push(item.id);
        if (item.hasRelevance == '1') {
          checkeID.push(item.id)
        };
        if (item.children) {
          item.children.forEach((d) => {
            ID.push(d.id);
            if (d.hasRelevance == '1') {
              checkeID.push(d.id)
            };
            if (d.children) {
              d.children.forEach((n) => {
                ID.push(n.id);
                if (n.hasRelevance == '1') {
                  checkeID.push(n.id)
                };
                if (n.children) {
                  n.children.forEach((x) => {
                    ID.push(x.id);
                    if (x.hasRelevance == '1') {
                      checkeID.push(x.id)
                    };
                  })
                }
              })
            }
          })
        }
      });
      const ids = ID.join();
      if (typeof func === 'function') {
        func(ids);
      }
      yield put({
        type: 'queryPermissSuccess',
        payload: {
          PermisTree: jsonResult.data,
          checkeID: checkeID
        }
      });
    },
    * queryParentIds({ payload: { userId, roleId, ids } }, { call, put }) {
      const { jsonResult } = yield call(roloManage.queryParentIds, { userId, roleId, ids});
      yield put({
        type: 'queryParentIdsSuccess',
        payload: {
          ParentIds: jsonResult.data
        }
      });
    },
    * remove({ payload: id }, { call, put }) {
      yield call(service.remove, id);
      yield put({ type: 'reload' });
    },
    * changeIds({ payload: params }, { call, put }) {
        yield put({
          type: 'reload' ,
          payload: {
            checkeID: params
          }
      });
    },
    * addRole({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(roloManage.addRole, params);
      if (typeof func == 'function') {
        func()
      }
      // message.success('添加成功!', 1.5, function() {  history.back(-1); });
    },
    * saveRole({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(roloManage.saveRole, params);
      yield put({
        type: 'reload' ,
        payload: {
          saveRole: params,
        }
      })
      if (typeof func == 'function') {
        func()
      }
    },
    * save({ payload: params }, { call, put }) {
      yield put({
        type: 'reload' ,
        payload: {
          saveSeslect: params
        }
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
