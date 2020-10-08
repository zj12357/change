import { addRule, getList, removeRule, updateRule ,getRolesList , enableAccounts, saveResource, getFunctionTree, selectRoleResource} from './service';
import { message } from 'antd';
const Model = {
  namespace: 'logListModel',
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
    *fetch({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      if (response && response.status) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      if (response && response.status) {
        if (callback) callback();
      }
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      if (response && response.status) {
        if (callback) callback();
      }
    },

    *enableAccount({ payload, callback }, { call, put }) {
      const response = yield call(enableAccounts, payload);
      if (response.status){
          message.error('操作成功');
          yield put({
            type: 'editEnable',
            payload: payload,
          });
      };
    },
    *getRolesLists({ payload, callback }, { call, put }) {
      const response = yield call(getRolesList, payload);
      if (response && response.status) {
        yield put({
          type: 'saveRloe',
          payload: response,
        });
      }
    },
    //保存用户获取权限
  *update({ payload, callback }, { call, put }) {
      const response = yield call(saveResource, payload);
      if (response.status && callback) callback();
  },
  *getResourceByAdminIdServe({ payload, callback }, { call, put }) {

      const response = yield call(  getFunctionTree );
      const responseSel = yield call(selectRoleResource, payload);

      if (response.status && responseSel.status) {
        let allResourcesList =  response.body.children,
            yelResourcesList = responseSel.body,
            idsArr = [];
        if (Array.isArray(yelResourcesList)) {
          yelResourcesList.forEach(item => {
            idsArr.push(item.id);
          });
        }
        if (Array.isArray(allResourcesList) && allResourcesList.length <= 0) {
          message.error('暂无可分配权限');
          return false;
        }
        yield put({
          type: 'getAllResourcesList',
          payload: { allResourcesList, yelResourcesList: idsArr },
        });
      }
    },
  },
  reducers: {
    save(state, action) {
      let { records, pages, current, total, size } = action.payload.body;
      let data = state.data;
      data = {
        ...data,
        list: records,
        pagination: {
          total,
          pageSize: size,
          current,
          pages,
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
      return { ...state ,data};
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
