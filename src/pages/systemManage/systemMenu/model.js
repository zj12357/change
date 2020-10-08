import {
  addRule,
  getList,
  removeRule,
  ModifySysRole,
  enableAccounts,
  SysPermissionList,
  DictionaryList
} from './service';
import {
  message
} from 'antd';
import {
  keysID,
  listId
} from './keys.js';
import {
  flatArrs
} from '@/utils/utils.js'
const Model = {
  namespace: 'systemMenuModel',
  state: {
    data: {
      list: [],
      pagination: {},
      roleList: [],
    },
  },
  effects: {
    * fetch({
      payload,
      callback
    }, {
      call,
      put
    }) {
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

    //筛选 字典接口元素
    * screenTypeEle({
      payload,
      callback
    }, {
      call,
      put
    }) {
      // PermissionType  权限类型
      const responseDictionary = yield call(DictionaryList, payload); //字典列表
      const responseSysPermission = yield call(SysPermissionList, payload); //权限列表
      if (responseDictionary && responseDictionary.resultData && responseSysPermission && responseSysPermission.resultData) {

        const type = payload.type || '元素';

        let dictList = responseDictionary.resultData.dictionaryList || [];
        dictList = dictList.filter(item => item.typeCode === 'PermissionType' && item.value === type);

        if (dictList.length <= 0) {
          if (callback) callback({});
          return;
        };

        const pTypeID = dictList[0].did;
        let sysList = responseSysPermission.resultData.sysPermissionList || [];
        sysList = flatArrs(sysList);
        sysList = sysList.filter(item => item.pTypeID === pTypeID);


        if (callback) callback({
          list: sysList,
          pTypeID
        });
      }
    },

    * add({
      payload,
      callback
    }, {
      call,
      put
    }) {
      const response = yield call(payload[keysID] ? ModifySysRole : addRule, payload);
      if (response && response.resultData) {
        if (callback) callback();
      }
    },

    * remove({
      payload,
      callback
    }, {
      call,
      put
    }) {
      const response = yield call(removeRule, payload);
      if (response && response.resultData) {
        if (callback) callback();
      }
    },

    * enableAccount({
      payload,
      callback
    }, {
      call,
      put
    }) {
      const response = yield call(enableAccounts, payload);
      if (response.resultData) {
        message.error('操作成功');
        yield put({
          type: 'editEnable',
          payload: payload,
        });
      };
    },


  },
  reducers: {
    save(state, action) {
      const {
        page = {}
      } = action.payload;
      const lists = action.payload[listId] || [];
      const {
        pageIndex = 1, pageCount = 1, pageSize = 30, pageRecord = 0
      } = page || {};;
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
      return {
        ...state,
        data
      };
    },
    editEnable(state, action) {
      let {
        list
      } = state.data;
      let data = state.data;
      let {
        id
      } = action.payload;
      let editList = list.map(item => {
        if (item.id === id) {
          item.enable = !item.enable;
        }
        return item
      })
      data = {
        ...data,
        list: editList
      };
      return {
        ...state,
        data,
      }
    },

  },
};
export default Model;
