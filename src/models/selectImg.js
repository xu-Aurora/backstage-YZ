import {selectImg} from '../api';

export default {
    namespace : 'selectImg',
    state : {
        list: {},
        listGroup: [],
        listMaterial: []
    },
    effects : {
      //图片分组
        * queryGroup({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(selectImg.queryGroup, params);
            jsonResult.data.forEach((item, index) =>{
                if(index) {
                    item.checked = false
                } else {
                    item.checked = true
                }
            })
              
            yield put({
                type: 'serchSuccess',
                payload: {
                    listGroup: jsonResult.data
                }
            });
            if (typeof func == 'function') {
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

        //图片素材
        * queryMaterial({ payload: {params, func}}, {call, put}){
            const {jsonResult} = yield call(selectImg.queryMaterial, params);
            yield put({
                type: 'serchSuccess',
                payload: {
                    listMaterial: jsonResult.data
                }
            });
            if (typeof func == 'function') {
                func();
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