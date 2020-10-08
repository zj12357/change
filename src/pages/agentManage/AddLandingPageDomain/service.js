import request from '@/utils/request';


//获取落地页域名绑定列表
export async function getList(params) {
  return request('/api/Proxy/LandingPageDomainList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加落地页域名绑定
export async function addRule(params) {
  return request('/api/LandingPage/AddLandingPageDomain', {
    method: 'POST',
    data: { ...params },
  });
}


//修改落地页域名绑定
export async function ModifySysRole(params) {
  return request('/api/LandingPage/ModifyLandingPageDomainParam', {
    method: 'POST',
    data: { ...params },
  });
}


//删除落地页域名绑定
export async function removeRule(params) {
  return request('/api/LandingPage/DeleteLandingPageDomainParam', {
    method: 'POST',
    data: { ...params },
  });
}

//单个落地页域名绑定
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//落地页域名绑定导航
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
