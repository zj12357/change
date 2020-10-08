import request from '@/utils/request';


//获取Ip黑名单列表
export async function getList(params) {
  return request('/api/SysSettings/GetSYSBlacklistList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加Ip黑名单
export async function addRule(params) {
  return request('/api/SysSettings/AddSysBlacklist', {
    method: 'POST',
    data: { ...params },
  });
}


//修改Ip黑名单
export async function ModifySysRole(params) {
  return request('/api/SysSettings/ModifySYSBlacklist', {
    method: 'POST',
    data: { ...params },
  });
}


//删除Ip黑名单
export async function removeRule(params) {
  return request('/api/SysSettings/DeleteSYSBlacklistParam', {
    method: 'POST',
    data: { ...params },
  });
}

//单个Ip黑名单
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//Ip黑名单导航
export async function SysNavigationList(params) {
  return request('/api/SysMenu/SysNavigationList', {
    method: 'POST',
    data: { ...params },
  });
}


//禁用 启用
export async function enableAccounts(params) {
  return request('/role/enable',{
    method: 'POST',
    data: { ...params },
  });
}
