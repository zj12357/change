import request from '@/utils/request';


//获取广告图列表
export async function getList(params) {
  return request('/api/LandingPage/CustomerList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加广告图
export async function addRule(params) {
  return request('/api/LandingPage/AddCustomer', {
    method: 'POST',
    data: { ...params },
  });
}


//修改广告图
export async function ModifySysRole(params) {
  return request('/api/LandingPage/ModifyCustomer', {
    method: 'POST',
    data: { ...params },
  });
}


//删除广告图
export async function removeRule(params) {
  return request('/api/LandingPage/DeleteCustomer', {
    method: 'POST',
    data: { ...params },
  });
}

//单个广告图
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//广告图导航
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
