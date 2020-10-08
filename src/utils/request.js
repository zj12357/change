/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, message } from 'antd';
import { baseUrl } from '@/utils/config.js';

import router from 'umi/router';

let isTimeOut = false;

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response } = error;
  console.error('请求报错··················', error, response);

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    message.error(`请求错误 ${status}: ${url},${errorText}`);
  } else if (!response) {
    message.error('您的网络发生异常，无法连接服务器');
  }

  return response;
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  prefix: baseUrl, //请求前缀 生产环境
  // prefix: '/server/api', //请求前缀 开发环境
  timeout: 200000, //超时时间
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {
  let Authorization = localStorage.getItem('Authorization');
  options = {
    ...options,
    data: {
      ...options.data,
      timestamp: 0,
      random: 'string',
      signature: 'string',
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: Authorization,
    },

    // data,
  };

  return {
    url,
    options,
  };
});

request.interceptors.response.use(async response => {
  // console.log('请求拦截器第一步',response);

  const data = await response.clone().json();

  if (data.resultCode === 401 || data.ResultCode === 4) {
    if (!isTimeOut) {
      message.error('未登录或登录过期，前往登录');
      isTimeOut = true;
    }
    localStorage.removeItem('Authorization');

    setTimeout(() => {
      router.push('/user/login');
    }, 1000);
    return false;
  } else if (data.resultCode !== 1) {
    if (data.message) {
      message.error(data.message);
    }
  }

  if (data && data.resultCode === 1) {
    isTimeOut = false;
  }

  return response;
});
export default request;
