import { addRule, getList, removeRule,ModifySysRole  , enableAccounts} from './service';
import { message } from 'antd';
import { keysID, listId } from './keys.js';
const Model = {
  namespace: 'LotteryFeatureListModel',
  state: {
    data: {
      list: [],
      pagination: {},
      roleList: [],
    },
  },
  effects: {
    *fetch({ payload , callback }, { call, put }) {
      const response = yield call(getList, payload);
      if (response && response.resultData) {
       if (callback) callback(response.resultData);
       if (payload.pageSize<100){
           yield put({
            type: 'save',
            payload: response.resultData,
          });
       }
      }
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call( payload[keysID] ? ModifySysRole : addRule, payload);
      if (response && response.resultData) {
        if (callback) callback();
      }
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      if (response && response.resultData) {
        if (callback) callback();
      }
    },

    *enableAccount({ payload, callback }, { call, put }) {
      const response = yield call(enableAccounts, payload);
      if (response.resultData){
          message.success('操作成功');
          yield put({
            type: 'editEnable',
            payload: payload,
          });
      };
    },


  },
  reducers: {
    save(state, action) {
      const { page = {} } = action.payload;
      const lists  = action.payload[listId] || [];
      const { pageIndex = 1, pageCount = 1, pageSize = 10, pageRecord = 0 } = page || {};;
      let data = state.data;
      data = {
        ...data,
        list: lists,
        pagination: {
          total:pageRecord,
          pageSize,
          current:pageIndex,
          pages:pageCount,
        },
      };
      return { ...state, data };
    },
    editEnable(state,action){
      let  { list }  = state.data;
      let data = state.data;
      let { id } = action.payload;
      let editList  = list.map(item=>{
        if(item.id === id){
            item.enable=!item.enable;
        }
        return item
      })
      data={ ...data,list:editList};
      return   {
        ...state,
        data,
      }
    },

  },
};
export default Model;
