import request from '@/utils/request';


//获取系统公告列表
export async function getList(params) {
  return request('/api/SysSettings/GetNoticeList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加系统公告
export async function addRule(params) {
  return request('/api/SysSettings/AddNotice', {
    method: 'POST',
    data: { ...params },
  });
}


//修改系统公告
export async function ModifySysRole(params) {
  return request('/api/SysSettings/ModifyNotice', {
    method: 'POST',
    data: { ...params },
  });
}


//删除系统公告
export async function removeRule(params) {
  return request('/api/SysSettings/DeleteNotice', {
    method: 'POST',
    data: { ...params },
  });
}

//单个系统公告
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//系统公告导航
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
