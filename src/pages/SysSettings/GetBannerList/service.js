import request from '@/utils/request';


//获取系统广告图列表
export async function getList(params) {
  return request('/api/SysSettings/GetBannerList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加系统广告图
export async function addRule(params) {
  return request('/api/SysSettings/AddBanner', {
    method: 'POST',
    data: { ...params },
  });
}


//修改系统广告图
export async function ModifySysRole(params) {
  return request('/api/SysSettings/ModifyBanner', {
    method: 'POST',
    data: { ...params },
  });
}


//删除系统广告图
export async function removeRule(params) {
  return request('/api/SysSettings/DeleteBanner', {
    method: 'POST',
    data: { ...params },
  });
}

//单个系统广告图
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//系统广告图导航
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
