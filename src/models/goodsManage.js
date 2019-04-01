import {goodsManage} from '../api';

export default {
    namespace : 'goodsManage',
    state : {
        list: {},
        groupList: []
    },
    effects : {
        * goodsList({ payload: params}, {call, put}){
            const {jsonResult} = yield call(goodsManage.goodsList, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    list: jsonResult.data
                }
            });
        },
        * goodsBatchUpdate({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(goodsManage.goodsBatchUpdate, params);
            if(typeof func == 'function') {
                func()
            }
        },
        * goodsUpdate({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(goodsManage.goodsUpdate, params);
            if(typeof func == 'function') {
                func()
            }
        },
        * goodsUpdateOther({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(goodsManage.goodsUpdateOther, params);
            if(typeof func == 'function') {
                func()
            }
        },
        * goodsCopy({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(goodsManage.goodsCopy, params);
            if(typeof func == 'function') {
                func()
            }
        },
        * getgroup({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(goodsManage.getgroup, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    groupList: jsonResult.data.list
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
        * queryDetail({payload: params}, {call, put}) {            
            const {jsonResult} = yield call(goodsManage.goodsDetail, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    ItemDetail: jsonResult.data
                }
            });
        },
        * setStatus({payload: {params, func}}, {call, put}) {            
            const {jsonResult} = yield call(goodsComment.setStatus, params);
            if(typeof func == 'function') {
                func()
            }
        },
        * getStock({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(goodsManage.getStock, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    stockInfo: jsonResult.data
                }
            });
            if(typeof func == 'function') {
                func()
            }
        },
        * updateStock({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(goodsManage.updateStock, params);
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