import {goodsComment} from '../api';
import {message} from 'antd';

export default {
    namespace : 'goodsComment',
    state : {
        list: {}
    },
    effects : {
        * serch({ payload: params}, {call, put}){
            const {jsonResult} = yield call(goodsComment.query, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    list: jsonResult.data
                }
            });
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