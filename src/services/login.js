import request from '@/utils/request';
export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

//服务器登陆
export async function userLogin(params) {
  return request('/api/SysUser/Login', {
    method: 'POST',
    data: params,
  });
}

//服务器退出登录
export async function userLogut() {
  return request(`/api/SysUser/Logout`,{
    method: 'POST',
  });
}


//获取 按钮权限
export async function DictionaryLists(params) {
  return request(`/api/Dictionary/DictionaryList`,{
    method: 'POST',
    data: params,
  });
}