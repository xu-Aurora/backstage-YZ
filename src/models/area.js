import {area} from '../api';

export default {
    namespace : 'area',
    state : {
        provinceCodeList: [
 
        ],
        cityCodeList: [
            
        ],
        allNameList: [
            
        ],
        buyerList: [ 
            {
              distributionAreaName: '所有区域默认（未勾选地区适用此费用）', // 
              distributionAreaCityCode: '0', 
              firstPrice: '', //首件
              firstPriceFreight: '', //运费
              continuation: '', //续件
              continuationFreight: '', //续费
              distributionAreaProvinceCode: ''
            }
        ],
        editStatus: false, //编辑状态
        editIndex: ''
    },
    reducers : {
        queryListSuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        }
    },
    effects : {
        * setList({ payload: params },{ put }){
             yield put({
                 type: 'queryListSuccess',
                 payload: {
                    ...params
                 }
             })
         }
    }
};
