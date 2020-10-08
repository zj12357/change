import {
  addRule,
  getList,
  removeRule,
  ModifySysRole,
  enableAccounts,
  DictionaryTypeList,
  VipLevel,
  OftenGames,
  ProxyLine,
  GetUserWithdrawal,
  GetUserDetailCollection,
  GetUserDesposit,
  GetUserBetsDetailHistory,
} from './service';
import { message } from 'antd';
import { keysID, listId } from './keys.js';

const Model = {
  namespace: 'getUserStatisticsList',
  state: {
    data: {
      list: [],
      pagination: {},
      roleList: [],
      vipList: [],
      gameList: [],
      proxyLineList: [],
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

    *DictionaryTypeLists({ payload, callback }, { call, put }) {
      const response = yield call(DictionaryTypeList, payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
      }
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(payload[keysID] ? ModifySysRole : addRule, payload);
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
      if (response.resultData) {
        message.success('操作成功');
        yield put({
          type: 'editEnable',
          payload: payload,
        });
      }
    },

    *vipLevel({ payload, callback }, { call, put }) {
      const response = yield call(VipLevel, payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
        yield put({
          type: 'saveVipLevel',
          payload: response.resultData,
        });
      }
    },
    *oftenGames({ payload, callback }, { call, put }) {
      const response = yield call(OftenGames, payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
        yield put({
          type: 'saveOftenGames',
          payload: response.resultData,
        });
      }
    },
    *proxyLine({ payload, callback }, { call, put }) {
      const response = yield call(ProxyLine, payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
        yield put({
          type: 'saveProxyLine',
          payload: response.resultData,
        });
      }
    },
    *GetUserWithdrawalList({ payload, callback }, { call, put }) {
      const response = yield call(GetUserWithdrawal, payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
      }
    },
    *GetUserDespositList({ payload, callback }, { call, put }) {
      const response = yield call(GetUserDesposit, payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
      }
    },
    *GetUserDetailCollectionList({ payload, callback }, { call, put }) {
      const response = yield call(GetUserDetailCollection, payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
      }
    },
    *GetUserBetsDetailHistorylist({ payload, callback }, { call, put }) {
      const response = yield call(GetUserBetsDetailHistory, payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
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
      let { id } = action.payload;
      let editList = list.map(item => {
        if (item.id === id) {
          item.enable = !item.enable;
        }
        return item;
      });
      data = { ...data, list: editList };
      return {
        ...state,
        data,
      };
    },
    saveVipLevel(state, action) {
      let { vipList } = action.payload;
      let data = { ...state.data, vipList };
      return {
        ...state,
        data,
      };
    },
    saveOftenGames(state, action) {
      let { gameList } = action.payload;
      let data = { ...state.data, gameList };
      return {
        ...state,
        data,
      };
    },
    saveProxyLine(state, action) {
      let data = { ...state.data, proxyLineList: action.payload };
      return {
        ...state,
        data,
      };
    },
  },
};
export default Model;
