import {serviceManage} from '../api';

export default {
    namespace : 'serviceManage',
    state : {
        list: [],
        infoList: []
    },
    effects : {
        * getList({ payload: {params,func}}, {call, put}){
            const {jsonResult} = yield call(serviceManage.getList, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    list: jsonResult.data
                }
            });
            if(typeof func == 'function') {
                func()
            }
        },
        * save({payload: params}, {call, put}) {
            yield put({
                type: 'serchSuccess',
                payload: {
                    saveSeslect: params
                }
            });
        },
        * getDetail({ payload: {params,func}}, {call, put}){
            const {jsonResult} = yield call(serviceManage.getDetail, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    infoList: jsonResult.data
                }
            });
            if(typeof func == 'function') {
                func()
            }
        }
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