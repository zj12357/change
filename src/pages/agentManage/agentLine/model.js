import {
  addRule,
  getList,
  removeRule,
  ModifySysRole,
  SysUserRoleList,
  SysUserRole,
  SysUserList,
  LandingDomainList,
  LandingPageDomainList,
  LandingPageDomain,
  ProxyCollectionList,
  ProxyCollectionLine,
  ProxyCollectionLineList,
  GetVerifyingModel,
  GetAgetnLogin,
  ProxyLoginDomain,
  ProxyLoginDomainList,
  DictionaryTypeList,
  ProxyCollectionActiveDomainList,
  GetProcyGroupList,
  UpdateProxyGroup,
} from './service';
import { message } from 'antd';
import { keysID, listId } from './keys.js';

// 获取分配列表
const typeGetList = {
  userAssignment: SysUserList,
  landingPageDomain: LandingDomainList,
  ProxyCollectionLine: ProxyCollectionList,
};

//获取已分配列表
const typeGetSelectedList = {
  userAssignment: SysUserRoleList,
  landingPageDomain: LandingPageDomainList,
  ProxyCollectionLine: ProxyCollectionLineList,
};

//调用分配接口
const InterfaceList = {
  userAssignment: SysUserRole,
  landingPageDomain: LandingPageDomain,
  ProxyCollectionLine: ProxyCollectionLine,
};

const Model = {
  namespace: 'agentLineModel',
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
    *getCustList({ callback, payload }, { call, put }) {
      const response = yield call(ProxyLoginDomainList, payload);
      if (response && response.resultData) {
        const { page = {} } = response.resultData;
        const lists = response.resultData.proxyLoginDomainList || [];
        const { pageIndex = 1, pageCount = 1, pageSize = 10, pageRecord = 0 } = page || {};
        if (callback) {
          callback({
            list: lists,
            pagination: {
              total: pageRecord,
              pageSize,
              current: pageIndex,
              pages: pageCount,
            },
          });
        }
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

    *ProxyCollectionActiveDomainLists({ payload, callback }, { call, put }) {
      const response = yield call(ProxyCollectionActiveDomainList, payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
      }
    },

    *getNeedList({ payload, callback }, { call, put }) {
      const response = yield call(typeGetList[payload.type], payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
      }
    },

    *ProxyLoginDomainLists({ payload, callback }, { call, put }) {
      const response = yield call(ProxyLoginDomainList, payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
      }
    },

    *ProxyLoginDomains({ payload, callback }, { call, put }) {
      const responseDict = yield call(DictionaryTypeList, {
        pageIndex: 1,
        pageSize: 300,
        code: 'ProxyLineState',
        showDisabled: true,
        showType: 1,
      });
      if (responseDict && responseDict.resultData) {
        let { dictionaryList = [] } = responseDict.resultData;
        dictionaryList = dictionaryList.filter(item => item.code === 'ProxyLineState');
        let stateID = dictionaryList[0] ? dictionaryList[0].dtid : '';
        payload = { ...payload, stateID };
        const response = yield call(ProxyLoginDomain, payload);
        if (response && response.resultData) {
          if (callback) callback(response.resultData);
        }
      }
    },

    *GetAgetnLogins({ payload, callback }, { call, put }) {
      const response = yield call(GetAgetnLogin, payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
      }
    },

    *GetVerifyingModels({ payload, callback }, { call, put }) {
      const response = yield call(GetVerifyingModel, payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
      }
    },

    *SysUserRoleLists({ payload, callback }, { call, put }) {
      const response = yield call(typeGetSelectedList[payload.type], payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
      }
    },

    *update({ payload, callback }, { call, put }) {
      const response = yield call(InterfaceList[payload.type], payload);
      if (response && response.resultData) {
        if (callback) callback();
      }
    },

    *getProcyGroupList({ payload, callback }, { call, put }) {
      const response = yield call(GetProcyGroupList, payload);
      if (response && response.resultData) {
        if (callback) callback(response.resultData);
      }
    },
    *updateProxyGroup({ payload, callback }, { call, put }) {
      const response = yield call(UpdateProxyGroup, payload);
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
  },
};
export default Model;
