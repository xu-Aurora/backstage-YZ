import {messagePush} from '../api';

export default {
    namespace : 'messagePush',
    state : {
        data: {},
    },
    effects : {
        * serch({payload: params}, {call, put}) {  //查询消息列表
            const {jsonResult} = yield call(messagePush.queryList, params);
            yield put({
                type: 'querySuccess',
                payload: {
                  data: jsonResult.data
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
        * detail({payload: params}, {call, put}) {
            const {jsonResult} = yield call(messagePush.queryDetail, params);
            yield put({
                type: 'querySuccess',
                payload: {
                    detailData: jsonResult.data
                }
            });
        },
        * add({ payload: { params,func}}, { call, put }) {
          yield call(messagePush.add, params);
          if (typeof func === 'function') {
            func();
          }
        }
    },
    reducers : {
      querySuccess(state, {payload}) {
          return {
              ...state,
              ...payload
          };
      }
    },

};
