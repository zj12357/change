import { addRule, getList, removeRule,ModifySysRole,AddMembers, enableAccounts,GetChatroomInfoById,GetUserInfoList} from './service';
import { message } from 'antd';
import { keysID, listId } from './keys.js';
import { genID } from '@/utils/utils.js';
const Model = {
  namespace: 'charRoomDetailsModel',
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
       if (response && response.resultCode === 1) {
       if (callback) callback(response.resultData);
       if (payload.pageSize<100){
           yield put({
            type: 'save',
            payload: {
              data:response.resultData,
              ...payload,
            },
          });
       }
      }
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call( AddMembers, payload);
       if (response && response.resultCode === 1) {
        if (callback) callback();
      }
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
       if (response && response.resultCode === 1) {
        if (callback) callback();
      }
    },

    *getCharRoomDetails({ payload, callback }, { call, put }) {
      const response = yield call(GetChatroomInfoById, payload);
       if (response && response.resultCode === 1) {
        if (callback) callback(response.resultData);
      }
    },
    *GetUserInfoLists({ payload, callback }, { call, put }) {
      const response = yield call(GetUserInfoList, payload);
       if (response && response.resultCode === 1) {
        if (callback) callback(response.resultData);
      }
    },

    *enableAccount({ payload, callback }, { call, put }) {
      const response = yield call(enableAccounts, payload);
      if (response && response.resultCode === 1) {
        if (callback) callback(response.resultData);
      }

    },


  },
  reducers: {
    save(state, action) {
      const { data = {}, pageIndex = 1, pageSize = 10 } = action.payload;
      const lists = (data.memberList || []).map(item=>{
        item.id = genID();
        return item;
      });
      const pageRecord = data.memberNum || 0;
      let datas = state.data;
      datas = {
        ...datas,
        list: lists,
        pagination: {
          total:pageRecord,
          pageSize,
          current:pageIndex,
          pages:Number.parseInt(pageRecord/pageSize),
        },
      };
      return { ...state,data: datas };
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
