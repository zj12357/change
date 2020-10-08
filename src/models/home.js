import { statistics, statisticsEarn ,quarter} from '@/services/home';
import { message } from 'antd';
const Model = {
  namespace: 'homeModel',
  state: {
    data: {},
  },
  effects: {
    *getStatistics({ payload, callback }, { call, put }) {
      let response = false;
      try {
        response = yield call(statistics, payload);
      } catch (error) {
        message.error('网络异常，请退出重新登录');
        console.error('首页图表异常', error);
      }
      if (response && response.status) {
        if (callback) callback(response.body);
      }
    },
    *getIncome({ payload, callback }, { call, put }) {
      let response = yield call(statisticsEarn, payload);
      if (response && response.status) {
        if (callback) callback(response.body);
      }
    },
    *quarters({ payload, callback }, { call, put }) {
      let response = yield call(quarter, payload);
      if (response && response.status) {
        if (callback) callback(response.body);
      }
    },
  },
  reducers: {},
};
export default Model;
