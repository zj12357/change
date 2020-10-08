import request from '@/utils/request';


//获取落地页列表
export async function getList(params) {
  return request('/api/LandingPage/GetLandingPageList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加落地页
export async function addRule(params) {
  return request('/api/LandingPage/AddLandingPage', {
    method: 'POST',
    data: { ...params },
  });
}


//修改落地页
export async function ModifySysRole(params) {
  return request('/api/LandingPage/ModifyLandingPage', {
    method: 'POST',
    data: { ...params },
  });
}


//删除落地页
export async function removeRule(params) {
  return request('/api/LandingPage/DeleteLandingPage', {
    method: 'POST',
    data: { ...params },
  });
}

//单个落地页
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//落地页导航
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
