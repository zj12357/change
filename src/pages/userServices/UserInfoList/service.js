import request from '@/utils/request';


//获取用户信息列表
export async function getList(params) {
  return request('/api/User/GetUserInfoList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加用户信息
export async function addRule(params) {
  return request('/api/Video/AddVideoType', {
    method: 'POST',
    data: { ...params },
  });
}


//修改用户信息
export async function ModifySysRole(params) {
  return request('/api/User/ModifyCMUserInfo', {
    method: 'POST',
    data: { ...params },
  });
}


//删除用户信息
export async function removeRule(params) {
  return request('/api/User/DeleteCMUserInfo', {
    method: 'POST',
    data: { ...params },
  });
}

//单个用户信息
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//用户信息导航
export async function SysNavigationList(params) {
  return request('/api/SysMenu/SysNavigationList', {
    method: 'POST',
    data: { ...params },
  });
}


//禁用 启用
export async function enableAccounts(params) {
  return request('/api/User/UpdateBlocked',{
    method: 'POST',
    data: { ...params },
  });
}
//重置密码
export async function ModifyPassWord(params) {
  return request('/api/User/ModifyPassWord',{
    method: 'POST',
    data: { ...params },
  });
}


//添加用户im
export async function AddUserIM(params) {
  return request('/api/TencentIM/AddUser',{
    method: 'POST',
    data: { ...params },
  });
}

//查询用户im
export async function SearchUserIM(params) {
  return request('/api/TencentIM/SearchUser',{
    method: 'POST',
    data: { ...params },
  });
}


export async function DeleteIM(params) {
  return request('/api/TencentIM/Delete',{
    method: 'POST',
    data: { ...params },
  });
}


//设置登录帐号失效
export async function DownLine(params) {
  return request('/api/TencentIM/DownLine',{
    method: 'POST',
    data: { ...params },
  });
}