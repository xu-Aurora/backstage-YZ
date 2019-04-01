import {serviceRelease} from '../api';

export default {
    namespace : 'serviceRelease',
    state : {
        categoryList: [],
        unitList: []
    },
    effects : {
        * getCategory({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(serviceRelease.getCategory, params);
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
        * getArea({ payload: params}, {call, put}){
            const {jsonResult} = yield call(serviceRelease.getArea, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    areaList: jsonResult.data
                }
            });
        },
        * getSupplier({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(serviceRelease.getSupplier, params);
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
        * getUnit({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(serviceRelease.getUnit, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    unitList: jsonResult.data
                }
            });
            if(typeof func == 'function') {
                func()
            }
        },
        * addService({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(serviceRelease.addService, params);
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