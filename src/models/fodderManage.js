import {fodderManage} from '../api';

export default {
    namespace : 'fodderManage',
    state : {
        list: {}
    },
    effects : {
      //图片分组
        * queryGroup({ payload: params}, {call, put}){
            const {jsonResult} = yield call(fodderManage.queryGroup, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    listGroup: jsonResult.data
                }
            });
        },
        * queryGroup1({ payload: params}, {call, put}){
            const {jsonResult} = yield call(fodderManage.queryGroup, params);
            jsonResult.data.splice(0,1)
            yield put({
                type: 'serchSuccess',
                payload: {
                    listGroup1: jsonResult.data
                }
            });
        },
        * save({payload: params}, {call, put}) {
            yield put({
                type: 'serchSuccess',
                payload: {
                    saveSeslect: params
                }
            });
        },
        * addGroup({ payload: { params,func}}, {call}) {
            yield call(fodderManage.addGroup, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * deleteGroup({payload: {params, func}}, {call, put}) {
            const {jsonResult} = yield call(fodderManage.deleteGroup, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * updateGroup({payload: {params,func}}, {call, put}) {
            const {jsonResult} = yield call(fodderManage.updateGroup, params);
            if (typeof func === 'function') {
                func();
            }
        },

      //图片素材
        * queryMaterial({ payload: params}, {call, put}){
            const {jsonResult} = yield call(fodderManage.queryMaterial, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    listMaterial: jsonResult.data
                }
            });
        },
        * addMaterial({ payload: {params,func}}, {call, put}) {
            yield call(fodderManage.addMaterial, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * deleteMaterial({payload: {params, func}}, {call, put}) {
            const {jsonResult} = yield call(fodderManage.deleteMaterial, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * updateMaterial({payload: {params,func}}, {call, put}) {
            const {jsonResult} = yield call(fodderManage.updateMaterial, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * detailMaterial({payload: params}, {call, put}) {            
          const {jsonResult} = yield call(fodderManage.detailMaterial, params);
          yield put({
              type: 'serchSuccess',
              payload: {
                  detail: jsonResult.data
              }
          });
        },
        * mobilePacket({payload: {params,func}}, {call, put}) {
          const {jsonResult} = yield call(fodderManage.mobilePacket, params);
          if (typeof func === 'function') {
              func();
          }
        },

    },
    reducers : {
        serchSuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        }
    }
}