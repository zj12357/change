import { addRule, getList, removeRule,ModifySysRole  , 
  enableAccounts,ModifyPassWord,
  DownLine,DeleteIM,SearchUserIM,
  AddUserIM,

} from './service';
import { message } from 'antd';
import { keysID, listId } from './keys.js';
const Model = {
  namespace: 'UserInfoListModel',
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

    *updatePassword({ payload, callback }, { call, put }) {
      const response = yield call(ModifyPassWord, payload);
      if (response && response.resultData) {
        if (callback) callback();
      }
    },

    *enableAccount({ payload, callback }, { call, put }) {
      const response = yield call(enableAccounts, payload);
      if (response.resultData){
          message.success('操作成功');
          callback&&callback()
      };
    },
    *DeleteIMs({ payload, callback }, { call, put }) {
      const response = yield call(DeleteIM, payload);
      if (response && response.resultData) {
        if (callback) callback();
      }
    },
    *DownLines({ payload, callback }, { call, put }) {
      const response = yield call(DownLine, payload);
      if (response && response.resultData) {
        if (callback) callback();
      }
    },
    *AddUserIMs({ payload, callback }, { call, put }) {
      const response = yield call(AddUserIM, payload);
      if (response && response.resultData) {
        if (callback) callback();
      }
    },
    
    *verificationIM({ payload, callback }, { call, put }) {
      const response = yield call(SearchUserIM, payload);
      if (response && response.resultData) {
        const list = response.resultData || [];
        if( list[0] && list[0].accountStatus === 'Imported'){
          message.error('该用户已创建IM账号，不能在继续创建！');
          return false;
        } else {
          if (callback) callback();
        }
      }
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
