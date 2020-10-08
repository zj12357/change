import { addMobile, getList, removeMobile } from './service';

import { keysID, listId } from './keys.js';
const Model = {
  namespace: 'SupplyListModel',
  state: {
    data: {
      list: [],
      roleList: [],
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
      const response = yield call(addMobile, payload);
      if (response && response.resultData) {
        if (callback) callback();
      }
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeMobile, payload);
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
