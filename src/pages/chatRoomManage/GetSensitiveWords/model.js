import { addRule, getList, removeRule,ModifySysRole  , enableAccounts} from './service';
import { message } from 'antd';
import { keysID, listId } from './keys.js';
const Model = {
  namespace: 'GetSensitiveWordsModel',
  state: {
    data: {
      list: [],
      pagination: {},
      roleList: [],
    },
  },
  effects: {
    *fetch({ payload , callback }, { call, put }) {
      console.log('payload',payload)
      if (payload.pageIndex){
        payload.start = (Number(payload.pageIndex)-1)*10;
        payload.count = 10;
      }
      const response = yield call(getList, payload);
      if (response && response.resultData) {
       if (callback) callback(response.resultData);
      //  if (payload.pageSize<100){
           yield put({
            type: 'save',
            payload: response.resultData,
          });
      //  }
      }
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call( payload.newword ? ModifySysRole : addRule, payload);
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
      const { words = [],total =1,count=1,start=0 } = action.payload;
      const lists  = action.payload[listId] || [];
      // const { pageIndex = 1, pageCount = 1, pageSize = 10, pageRecord = 0 } = page || {};
      let data = state.data;
      console.log(Number(start)+1,action.payload)
      data = {
        ...data,
        list: words,
        pagination: {
          total:total,
          pageSize:10,
          current:Number.parseInt(start/10)+1,
          // pages:pageCount,
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
