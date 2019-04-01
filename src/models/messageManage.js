import {messageManage} from '../api';

export default {
    namespace : 'messageManage',
    state : {
        data: {},
    },
    effects : {
        * serchMsg({payload: params}, {call, put}) {  //查询消息列表
            const {jsonResult} = yield call(messageManage.messageList, params);
            yield put({
                type: 'querySuccess',
                payload: {
                    dataMsg: jsonResult.data
                }
            });
        },
        * serchSms({payload: params}, {call, put}) {  //查询短信列表
            const {jsonResult} = yield call(messageManage.smsList, params);
            yield put({
                type: 'querySuccess',
                payload: {
                    dataSms: jsonResult.data
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
        * msgDetail({payload: params}, {call, put}) {
            const {jsonResult} = yield call(messageManage.messageDetail, params);
            yield put({
                type: 'querySuccess',
                payload: {
                    msgDetail: jsonResult.data
                }
            });
        },
        * smsDetail({payload: params}, {call, put}) {
            const {jsonResult} = yield call(messageManage.smsDetail, params);
            yield put({
                type: 'querySuccess',
                payload: {
                  smsDetail: jsonResult.data
                }
            });
        },
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
