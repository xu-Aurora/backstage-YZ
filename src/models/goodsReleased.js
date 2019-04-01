import {goodsReleased} from '../api';

export default {
    namespace : 'goodsReleased',
    state : {
        parameterList: [],
        categoryList: [],
        detailList: [],
        isTableStatus: false
    },
    effects : {
        * getParameter({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(goodsReleased.getParameter, params);
            jsonResult.data.list.forEach((item, index) =>{
                if(index) {
                    item.checked = false
                } else {
                    item.checked = true
                }
            })
            yield put({
                type: 'serchSuccess',
                payload: {
                    parameterList: jsonResult.data.list
                }
            });
            if(typeof func == 'function') {
                func()
            }
        },
        * addParameter({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(goodsReleased.addParameter, params);
            if(typeof func == 'function') {
                func()
            }
        },
        * upadteGoods({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(goodsReleased.upadteGoods, params);
            if(typeof func == 'function') {
                func()
            }
        },
        * addGoods({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(goodsReleased.addGoods, params);
            if(typeof func == 'function') {
                func()
            }
        },
        * detailGoods({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(goodsReleased.detailGoods, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    detailList: jsonResult.data
                }
            });
            if(typeof func == 'function') {
                func()
            }
        },
        * getCategory({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(goodsReleased.getCategory, params);
            jsonResult.data.forEach((item) =>{
                item.checked = false
                if(item.categoryVos) {
                    item.categoryVos.forEach((data) =>{
                        data.checked = false
                    })
                }
            })
            yield put({
                type: 'serchSuccess',
                payload: {
                    categoryList: jsonResult.data
                }
            });
            if(typeof func == 'function') {
                func()
            }
        },
        * getgroup({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(goodsReleased.getgroup, params);
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
        * getArea({ payload: params}, {call, put}){
            const {jsonResult} = yield call(goodsReleased.getArea, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    areaList: jsonResult.data
                }
            });
        },
        * getSupplier({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(goodsReleased.getSupplier, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    supplierList: jsonResult.data.list
                }
            });
            if(typeof func == 'function') {
                func()
            }
        },
        * getFreight({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(goodsReleased.getFreight, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    freightList: jsonResult.data
                }
            });
            if(typeof func == 'function') {
                func()
            }
        },
        * setTableStatus({ payload: params}, {call, put}){
            yield put({
                type: 'serchSuccess',
                payload: {
                    isTableStatus: params
                }
            });
        },
        * uploadImg({ payload: {params, func}}, {call, put}){
            const jsonResult = yield call(goodsReleased.uploadImg, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    imgInfo: jsonResult
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