import {
  addRule,
  getList,
  removeRule,
  ModifySysRole,
  Freeze,
  UnFreeze,
  SysUserPermissionsList,
  SysUserRoleList,
  SysUserRole,
  ModifyPassword,
  ModifySysUserPassword,
  RegisterUser,
} from './service';
import { message } from 'antd';
import { keysID, listId } from './keys.js';
const Model = {
  namespace: 'userMangeModel',
  state: {
    data: {
      list: [],
      pagination: {},
      roleList: [],
      sysUserList: [],
    },
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
        if (payload.pageSize < 100) {
          yield put({
            type: 'save',
            payload: response.resultData,
          });
        }
      }
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(payload[keysID] ? ModifySysRole : addRule, payload);

      //创建用户同时  注册一个 聊天室用户
      if ( !payload[keysID] ){
          const responseRegisterUser = yield call(RegisterUser,payload);
      }

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
      const response = yield call(payload.stateName === '正常' ? Freeze : UnFreeze, payload);
      if (response.resultData) {
        message.success('操作成功');
        yield put({
          type: 'editEnable',
          payload: payload,
        });
      }
    },

    *SysUserRoleLists({ payload, callback }, { call, put }) {
      const response = yield call(SysUserRoleList, payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
      }
    },

    *update({ payload, callback }, { call, put }) {
      const response = yield call(SysUserRole, payload);
      if (response && response.resultData) {
        if (callback) callback();
      }
    },

    *PermissionListData({ payload, callback }, { call, put }) {
      const response = yield call(SysUserPermissionsList, payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
      }
    },

    *updatePassword({ payload, callback }, { call, put }) {
      const response = yield call(
        payload.oldPassword ? ModifyPassword : ModifySysUserPassword,
        payload,
      );
      if (response && response.resultData) {
        if (callback) callback();
      }
    },
  },
  reducers: {
    save(state, action) {
      const { page = {} } = action.payload;
      const lists = action.payload[listId] || [];
      const { pageIndex = 1, pageCount = 1, pageSize = 10, pageRecord = 0 } = page || {};

      let data = state.data;
      data = {
        ...data,
        list: lists,
        pagination: {
          total: pageRecord,
          pageSize,
          current: pageIndex,
          pages: pageCount,
        },
      };
      return { ...state, data };
    },
    editEnable(state, action) {
      let { list } = state.data;
      let data = state.data;
      let { userID } = action.payload;
      let editList = list.map(item => {
        if (item.userID === userID) {
          item.stateName = item.stateName === '正常' ? '冻结' : '正常';
        }
        return item;
      });
      data = { ...data, list: editList };
      return {
        ...state,
        data,
      };
    },
  },
};
export default Model;
