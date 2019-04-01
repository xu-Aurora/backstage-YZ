import {organizationManagement} from '../api';

export default {
    namespace : 'organizationManagement',
    state : {
        firstTree: [],
        institutionsDetail: []
    },
    effects : {
        * getTree({ payload: params }, { call, put }) {
            const { jsonResult } = yield call(organizationManagement.getTree, params);
            function addStatus(data){
                data.forEach((i)=>{
                    i.isUp = false
                    i.checked = false
                    if(i.childrens){
                        addStatus(i.childrens)
                    }
                })
            }
            jsonResult.data.list.forEach((item,index) => {
                item.isUp = false // 是否收起的判断
                item.checked = false //是否选中的判断
                if(item.childrens){
                    addStatus(item.childrens)
                }
            });
            yield put({
              type: 'serchSuccess',
              payload: {
                firstTree : jsonResult.data.list || [],
                treeInfo: ''
              }
            });
        },
        * saveTree ({ payload: params }, { call, put }) {
            yield put({
              type: 'serchSuccess',
              payload: {
                treeInfo: params
              }
            });
          },
        * addInstitutions({ payload: {params,func}}, {call, put}){
            const {jsonResult} = yield call(organizationManagement.addInstitutions, params);
            if(typeof func == 'function') {
                func()
            }
        },
        * getInstitutions({ payload: params }, { call, put }) {
            const { jsonResult } = yield call(organizationManagement.getInstitutions, params);
            yield put({
              type: 'serchSuccess',
              payload: {
                institutionsData : jsonResult.data
              }
            });
        },
        * saveInstitutions ({ payload: params }, { call, put }) {
            yield put({
              type: 'serchSuccess',
              payload: {
                institutionsInfo: params
              }
            });
        },
        * detailInstitutions ({ payload: params }, { call, put }) {
            const { jsonResult } = yield call(organizationManagement.detailInstitutions, params);
            yield put({
              type: 'serchSuccess',
              payload: {
                institutionsDetail: jsonResult.data
              }
            });
        },
        * deleteInstitutions ({ payload: {params, func} }, { call, put }) {
            const { jsonResult } = yield call(organizationManagement.deleteInstitutions, params);
            if(typeof func == 'function') {
                func()
            }
        },
        * updateInstitutions ({ payload: {params, func} }, { call, put }) {
            const { jsonResult } = yield call(organizationManagement.updateInstitutions, params);
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