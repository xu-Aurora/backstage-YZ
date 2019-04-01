import { houseManagement } from '../api';
import { message } from 'antd';

export default {
  namespace: 'houseManagement',
  state: {
    areaData: [],
    communisData: [],
    gardenData: [],
    institutionsData: [],
    zxhsData: [],
    unitData: [],
    hoseData: [],
    detailCommunisData: '',
    detailBuildingData:[],
    communisId: '',
    zxhsInfo: '',
    unitInfo: '',
    houseDetail: ''
  },
  reducers: {
    queryListSuccess(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    * getArea({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(houseManagement.getArea, params);
      
      jsonResult.data.forEach((item) =>{
        item.isUp = false
        if(item.areas) {
          item.areas.forEach((i)=>{
            i.isUp = false
          })
        }
      })
      
      yield put({
        type: 'queryListSuccess',
        payload: {
          areaData: jsonResult.data
        }
      });
    },
    * getCommunis({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(houseManagement.getCommunis, params);
      jsonResult.data.list.forEach((item) =>{
        item.isUp = false
        item.checked = false
      })
      yield put({
        type: 'queryListSuccess',
        payload: {
          communisData: jsonResult.data.list || []
        }
      });
      if(typeof func == 'function') {
        func()
      }
    },
    * getGarden({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(houseManagement.getGarden, params);
      jsonResult.data.list.forEach((item) =>{
        item.checked = false
      })
      yield put({
        type: 'queryListSuccess',
        payload: {
          gardenData: jsonResult.data.list || []
        }
      });
      if(typeof func == 'function') {
        func()
      }
    },
    * getInstitutions({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(houseManagement.getInstitutions, params);
      yield put({
        type: 'queryListSuccess',
        payload: {
          institutionsData: jsonResult.data.list
        }
      });
    },
    * addCommunis({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(houseManagement.addCommunis, params);
      if(typeof func == 'function') {
        func()
      }
    },
    * detailCommunis({ payload: {params, func}}, { call, put }) {
      const { jsonResult } = yield call(houseManagement.detailCommunis, params);
      yield put({
        type: 'queryListSuccess',
        payload: {
          detailCommunisData: jsonResult.data
        }
      });
      if(typeof func == 'function') {
        func()
      }
    },
    * saveCommunisId({ payload: params }, { call, put }) {
      yield put({
        type: 'queryListSuccess',
        payload: {
          communisId: params
        }
      });
    },
    * updateCommunis({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(houseManagement.updateCommunis, params);
      if(typeof func == 'function') {
        func()
      }
    },
    * clearRight({ payload: params }, { call, put }) {
      yield put({
        type: 'queryListSuccess',
        payload: {
          communityRight: '',
          gardenRight: ''
        }
      });
    },
    * saveCommunityRight({ payload: params }, { call, put }) {
      yield put({
        type: 'queryListSuccess',
        payload: {
          communityRight: params,
          gardenRight: ''
        }
      });
    },
    * saveGardenRight({ payload: params }, { call, put }) {
      yield put({
        type: 'queryListSuccess',
        payload: {
          gardenRight: params
        }
      });
    },
    * addBuilding({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(houseManagement.addBuilding, params);
      if(typeof func == 'function') {
        func()
      }
    },
    * detailBuilding({ payload: params}, { call, put }) {
      const { jsonResult } = yield call(houseManagement.detailBuilding, params);
      yield put({
        type: 'queryListSuccess',
        payload: {
          detailBuildingData: jsonResult.data
        }
      })
    },
    * getZxhs({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(houseManagement.getZxhs, params);
      jsonResult.data.list.forEach((item, index) =>{
        if(index){
          item.status = false
        } else{
          item.status = true
        }
      })
      yield put({
        type: 'queryListSuccess',
        payload: {
          zxhsData: jsonResult.data.list || [],
          unitData: [],
          hoseData: []
        }
      });
      if(typeof func == 'function') {
        func()
      }
    },
    * saveZxhs({ payload: params }, { call, put }) {
      yield put({
        type: 'queryListSuccess',
        payload: {
          zxhsInfo: params
        }
      });
    },
    * getUnit({ payload:  {params, func} }, { call, put }) {
      const { jsonResult } = yield call(houseManagement.getUnit, params);
      jsonResult.data.list.forEach((item, index) =>{
        if(index){
          item.status = false
        } else{
          item.status = true
        }
      })
      yield put({
        type: 'queryListSuccess',
        payload: {
          unitData: jsonResult.data.list || []
        }
      });
      if(typeof func == 'function') {
        func()
      }
    },
    * saveUnit({ payload: params }, { call, put }) {
      yield put({
        type: 'queryListSuccess',
        payload: {
          unitInfo: params
        }
      });
    },
    * addRoom({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(houseManagement.addRoom, params);
      if(typeof func == 'function') {
        func()
      }
    },
    * editRoom({ payload: {params, func} }, { call, put }) {
      const { jsonResult } = yield call(houseManagement.editRoom, params);
      if(typeof func == 'function') {
        func()
      }
    },
    * getHose({ payload: params }, { call, put }) {
      const { jsonResult } = yield call(houseManagement.getHose, params);
      yield put({
        type: 'queryListSuccess',
        payload: {
          hoseData: jsonResult.data
        }
      });
    },
    * saveHouse({ payload: params }, { call, put }) {
      yield put({
        type: 'queryListSuccess',
        payload: {
          houseDetail: params
        }
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/services') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    }
  }
};
