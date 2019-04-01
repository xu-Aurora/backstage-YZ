import { orderList } from '../api';

export default {
    namespace : 'orderList',
    state : {
        list: {}
    },
    effects : {
        * serch({ payload: params}, {call, put}){
            for(let item in params){
                if(!item || item == ''){
                    delete params.item
                }
            }

            const {jsonResult} = yield call(orderList.query, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    list: jsonResult.data
                }
            });
        },
        * detail({payload: params}, {call, put}) {            
            const {jsonResult} = yield call(orderList.detail, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    detail: jsonResult.data
                }
            });
        },
        * refundDetails({payload: params}, {call, put}) {        //售后管理详情    
            const {jsonResult} = yield call(orderList.refundDetails, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    refundDetailData: jsonResult.data
                }
            });
        },
        * delivery({ payload: {params,func}}, {call, put}){    //发货
            yield call(orderList.delivery, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * closeOrder({ payload: {params,func}}, {call, put}){    //关闭订单
            yield call(orderList.closeOrder, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * updateLogistics({ payload: {params,func}}, {call, put}){    //修改物流
            yield call(orderList.updateLogistics, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * refundAudit({ payload: {params,func}}, {call, put}){    //订单退款审核
            yield call(orderList.refundAudit, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * refundConfirm({ payload: {params,func}}, {call, put}){    //订单退款确认
            yield call(orderList.refundConfirm, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * confirmReceiptPc({ payload: {params,func}}, {call, put}){    //订单确认收货
            yield call(orderList.confirmReceiptPc, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * serverRefund({ payload: {params,func}}, {call, put}){    //服务退款
            yield call(orderList.serverRefund, params);
            if (typeof func === 'function') {
                func();
            }
        },
        * serchTime({ payload: params}, {call, put}){   //预约时间
            const {jsonResult} = yield call(orderList.queryTime, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    timeData: jsonResult.data
                }
            });
        },
        * serchCom({ payload: params}, {call, put}){   //小区
            const {jsonResult} = yield call(orderList.queryCom, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    comData: jsonResult.data
                }
            });

        },
        * refundInfo({ payload: {params,func}}, {call, put}){   //退款信息
            const {jsonResult} = yield call(orderList.refundInfo, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    refundInfoData: jsonResult.data
                }
            });
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