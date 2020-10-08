import {
  addRule,
  getList,
  removeRule,
  ModifySysRole,
  updateRule,
  getRolesList,
  enableAccounts,
  saveResource,
  getFunctionTree,
  selectRoleResource,
  getFunctionTreeCurrent,
  SysPermissionList,
  SysRoleMenusList,
  SysPermissionListAll,
  SysMenuList,
  SysRolePermission,
  SysRoleMenu,
} from './service';
import { message } from 'antd';
import { flatArrs } from '@/utils/utils.js';
const Model = {
  namespace: 'roleListModel',
  state: {
    data: {
      list: [],
      pagination: {},
      roleList: [],
      allResourcesList: [], //当前登录用户所能分配权限资源
      yelResourcesList: [], //当前角色已有权限资源
    },
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);

      if (response && response.resultData) {
        if (callback) callback(response.resultData);
        yield put({
          type: 'save',
          payload: response.resultData,
        });
      }
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(payload.id ? ModifySysRole : addRule, payload);
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

    *update({ payload, callback }, { call, put }) {
      const response = yield call(SysRolePermission, payload);
      if (response && response.resultData) {
        if (callback) callback();
      }
    },

    *getResourceByAdminIdServe({ payload, callback }, { call, put }) {
      let { parentCode, ...rest } = payload;
      const response = yield call(SysPermissionList, rest); //获取已分配菜单权限 列表
      let params = {
        pageIndex: 1,
        pageSize: 100,
      };
      if (parentCode) {
        params.parentRoleCode = parentCode;
      }
      const responseSel = yield call(SysMenuList, { ...params }); //获取菜单权限 所有分配列表

      if (response.resultData && responseSel.resultData) {
        const allResourcesList = responseSel.resultData.sysMenuList || [];
        const yelResourcesList = response.resultData.sysRolePermissionList || [];

        if (Array.isArray(allResourcesList) && allResourcesList.length <= 0) {
          message.error('暂无可分配权限');
          return false;
        }

        if (callback) callback(allResourcesList, yelResourcesList);

        // yield put({
        //   type: 'getAllResourcesList',
        //   payload: { allResourcesList, yelResourcesList },
        // });
      }
    },
  },
  reducers: {
    save(state, action) {
      const { page = {}, sysRoleList = [] } = action.payload;
      const { pageIndex = 1, pageCount = 1, pageSize = 10, pageRecord = 0 } = page;
      let data = state.data;
      data = {
        ...data,
        list: sysRoleList,
        pagination: {
          total: pageRecord,
          pageSize,
          current: pageIndex,
          pages: pageCount,
        },
      };
      return { ...state, data };
    },
    saveRloe(state, action) {
      let { body = [] } = action.payload;
      let data = state.data;
      data = {
        ...data,
        roleList: body,
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
    getAllResourcesList(state, action) {
      const { allResourcesList, yelResourcesList } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          allResourcesList,
          yelResourcesList,
        },
      };
    },
  },
};
export default Model;
