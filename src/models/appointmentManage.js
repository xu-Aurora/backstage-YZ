import {appointmentManage} from '../api';

export default {
    namespace : 'appointmentManage',
    state : {
        list: {}
    },
    effects : {
        * serch({ payload: params}, {call, put}){
            const {jsonResult} = yield call(appointmentManage.queryList, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    list: jsonResult.data
                }
            });
        },
        * serchDetail({ payload: params}, {call, put}){
            const {jsonResult} = yield call(appointmentManage.detail, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    detail: jsonResult.data
                }
            });
        },
        * orderRecord({ payload: params}, {call, put}){
            const {jsonResult} = yield call(appointmentManage.orderRecord, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    orderRecordData: jsonResult.data
                }
            });
        },
        * salesman({ payload: params}, {call, put}){   //业务员
            const {jsonResult} = yield call(appointmentManage.salesman, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    salesmanData: jsonResult.data
                }
            });
        },
        * serchTime({ payload: params}, {call, put}){   //预约时间
            const {jsonResult} = yield call(appointmentManage.queryTime, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    timeData: jsonResult.data
                }
            });
        },
        * serchCom({ payload: params}, {call, put}){   //小区
            const {jsonResult} = yield call(appointmentManage.queryCom, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    comData: jsonResult.data
                }
            });
        },
        * updateTime({ payload: {params, func}}, {call}) {  //修改时间
            yield call(appointmentManage.updateTime, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * allotOrder({ payload: {params, func}}, {call}) {  //分配订单
            yield call(appointmentManage.allotOrder, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * cancelOrder({ payload: {params, func}}, {call}) {  //取消订单
            yield call(appointmentManage.cancelOrder, params);
            if (typeof func === 'function') {
                func();
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