import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { stringify } from 'querystring';
import {
  fakeAccountLogin,
  getFakeCaptcha,
  userLogin,
  userLogut,
  DictionaryLists,
} from '@/services/login';
import {
  getResourceByAdminId,
  getFunctionTree,
  SysUserPermissionsList,
  ModifyPassword,
} from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery, splicingTree, getUserInfo, flatArrs } from '@/utils/utils';
import { message } from 'antd';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    currentUser: {},
    sysUserPermissionList: [], //分配页面权限列表
    dictionaryList: [], //按钮 及 图标数组
  },
  effects: {
    *login({ payload }, { call, put }) {
      delete payload.type;
      console.log('payload', payload);
      const response = yield call(userLogin, payload);

      if (response && response.resultCode === 1 && response.resultData.accessToken) {
        const { accessToken, userID } = response.resultData;

        localStorage.setItem('Authorization', accessToken);
        localStorage.setItem('userInfo', JSON.stringify(response.resultData));
        message.success('登录成功');
        setTimeout(() => {
          router.replace('/');
        }, 600);
      }
    },
    //获取当前用户菜单列表
    *fetchGetResourceByAdminId({ callback }, { call, put }) {
      let response = false;
      try {
        response = yield call(getFunctionTree);
      } catch (error) {
        message.error('网络异常，请退出重新登录');
        console.error('请求菜单异常', error);
      }
      if (response && response.resultData) {
        callback && callback(splicingTree(response.resultData.sysNavigationList));
        const sysUserPermissionList = flatArrs(
          response.resultData.sysNavigationList,
          'subSysNavigationList',
        );
        yield put({
          type: 'saveList',
          payload: { sysUserPermissionList },
        });
      }
    },
    //获取当前用户权限列表
    *getsysUserPermissionList({ callback }, { call, put }) {
      const response = yield call(DictionaryLists, {
        showType: 3,
        showDisabled: true,
        pageIndex: 1,
        pageSize: 300,
      }); //字典按钮 权限列表
      if (response && response.resultData) {
        const dictionaryList = response.resultData.dictionaryList || [];
        yield put({
          type: 'dictionaryList',
          payload: { dictionaryList },
        });
      }
    },
    //修改密码
    *cipherEdit({ payload, callback }, { call, put }) {
      const response = yield call(ModifyPassword, payload);
      if (response && response.resultData) {
        callback && callback();
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
    /** 退出登录*/
    *logout(_, { call, put }) {
      const { redirect } = getPageQuery(); // redirect
      const response = yield call(userLogut);

      if (response && response.resultData) {
        message.success('退出成功');
        localStorage.removeItem('Authorization');
      }

      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      return { ...state, currentUser: payload };
    },
    saveList(state, { payload }) {
      return { ...state, ...payload };
    },
    dictionaryList(state, { payload }) {
      return { ...state, ...payload };
    },
    //保存登录获得的用户信息  currentUser
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },
  },
};
export default Model;
