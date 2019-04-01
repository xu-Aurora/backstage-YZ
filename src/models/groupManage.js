import {groupManage} from '../api';

export default {
    namespace : 'groupManage',
    state : {
        groupList: []
    },
    effects : {
        * getList({ payload: {params,func}}, {call, put}){
            const {jsonResult} = yield call(groupManage.getList, params);
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
        * addGroup({ payload: {params,func}}, {call, put}){
            const {jsonResult} = yield call(groupManage.addGroup, params);
            if(typeof func == 'function') {
                func()
            }
        },
        * updateGroup({ payload: {params,func}}, {call, put}){
            const {jsonResult} = yield call(groupManage.updateGroup, params);
            if(typeof func == 'function') {
                func()
            }
        },
        * updateStateGroup({ payload: {params,func}}, {call, put}){
            const {jsonResult} = yield call(groupManage.updateStateGroup, params);
            if(typeof func == 'function') {
                func()
            }
        },
        * moveUpGroup({ payload: {params,func}}, {call, put}){
            const {jsonResult} = yield call(groupManage.moveUpGroup, params);
            if(typeof func == 'function') {
                func()
            }
        },
        * moveDownGroup({ payload: {params,func}}, {call, put}){
            const {jsonResult} = yield call(groupManage.moveDownGroup, params);
            if(typeof func == 'function') {
                func()
            }
        },

        * deleteGroup({ payload: {params,func}}, {call, put}){
            const {jsonResult} = yield call(groupManage.deleteGroup, params);
            if(typeof func == 'function') {
                func()
            }
        },
        * save({
            payload: params
        }, {call, put}) {
            yield put({
                type: 'serchSuccess',
                payload: {
                    saveSeslect: params
                }
            });
        },
        * queryDetail({
            payload: params
        }, {call, put}) {            
            const {jsonResult} = yield call(goodsComment.detail, params);
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