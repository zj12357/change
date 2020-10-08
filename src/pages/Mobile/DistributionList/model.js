import {
  addRule,
  getList,
  removeRule,
  ModifySysRole,
  Apply,
  CancelApply,
  ConfirmApply,
  ApplyRecordList,
} from './service';

import { keysID, listId } from './keys.js';
const Model = {
  namespace: 'DistributionListModel',
  state: {
    data: {
      list: [],
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

    *apply({ payload, callback }, { call, put }) {
      const response = yield call(Apply, payload);
      if (response && response.resultData) {
        if (callback) callback();
      }
    },

    *cancelApply({ payload, callback }, { call, put }) {
      const response = yield call(CancelApply, payload);
      if (response && response.resultData) {
        if (callback) callback();
      }
    },

    *confirmApply({ payload, callback }, { call, put }) {
      const response = yield call(ConfirmApply, payload);
      if (response && response.resultData) {
        if (callback) callback();
      }
    },
    *applyRecordList({ payload, callback }, { call, put }) {
      const response = yield call(ApplyRecordList, payload);
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
  },
};
export default Model;
