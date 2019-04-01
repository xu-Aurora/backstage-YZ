import {issueManagement} from '../api';
import {message} from 'antd';

export default {
    namespace : 'issueManagement',
    state : {
        list: {}
    },
    effects : {
        * serch({ payload: params}, {call, put}){
            const {jsonResult} = yield call(issueManagement.query, params);
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