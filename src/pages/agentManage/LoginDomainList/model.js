import { getList } from './service';

import { keysID, listId } from './keys.js';
const Model = {
  namespace: 'LoginDomainListModel',
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
